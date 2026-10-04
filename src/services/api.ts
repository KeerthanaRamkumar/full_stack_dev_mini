/**
 * Resilient API Client Service
 * Connects to the Express backend when running (e.g. locally with MongoDB or Node.js),
 * and provides seamless automatic fallback to the in-browser local storage engine
 * if deployed on Vercel (static), offline, or if the backend is unreachable.
 */

import { localStore } from './localFallbackStore';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic JSON request handler with automatic fallback
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn?: () => Promise<T>
): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (common on Vercel 404/SPA rewrite) or 404 status
    if (response.status === 404 || contentType.includes('text/html')) {
      if (fallbackFn) {
        console.warn(`[API] Endpoint ${endpoint} returned ${response.status} HTML. Using local engine fallback.`);
        return await fallbackFn();
      }
      throw new Error(`Endpoint not found: ${endpoint}`);
    }

    const data = await response.json();

    if (!response.ok) {
      // If error is business error (e.g. duplicate email, wrong pass), don't fallback to success
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      if (fallbackFn) return await fallbackFn();
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // If it's an explicit validation error thrown above, re-throw it
    if (
      error.message &&
      (error.message.includes('exists') ||
        error.message.includes('credentials') ||
        error.message.includes('Password') ||
        error.message.includes('denied'))
    ) {
      throw error;
    }

    // Network / offline / Vercel fallback
    if (fallbackFn) {
      console.warn(`[API] Network error connecting to ${endpoint}: ${error.message}. Using local engine.`);
      return await fallbackFn();
    }
    throw error;
  }
}

// ---- AUTH API ----
export const authAPI = {
  async register(userData: { name: string; email: string; password: string; confirmPassword?: string }) {
    return request<{ success: boolean; message: string; token: string; user: any }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      () => localStore.register(userData.name, userData.email, userData.password)
    );
  },

  async login(credentials: { email: string; password: string }) {
    return request<{ success: boolean; message: string; token: string; user: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      () => localStore.login(credentials.email, credentials.password)
    );
  },

  async getMe() {
    return request<{ success: boolean; user: any }>(
      '/api/auth/me',
      {},
      () => localStore.getMe()
    );
  },

  async updateProfile(profileData: { name?: string; bio?: string; profileImage?: string }) {
    return request<{ success: boolean; message: string; user: any }>(
      '/api/auth/profile',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      },
      () => localStore.updateProfile(profileData)
    );
  },

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);
    return request<{ success: boolean; message: string; imageUrl: string; filename: string; user: any }>(
      '/api/auth/profile-image',
      {
        method: 'POST',
        body: formData,
      },
      () => localStore.uploadProfileImage(file)
    );
  },
};

// ---- BLOGS API ----
export const blogsAPI = {
  async getBlogs(params: { search?: string; category?: string; tag?: string; page?: number; limit?: number; status?: string } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.status) query.set('status', params.status);

    return request<{ success: boolean; blogs: any[]; total: number; page: number; totalPages: number }>(
      `/api/blogs?${query.toString()}`,
      {},
      () => localStore.getBlogs(params)
    );
  },

  async getBlogById(id: string) {
    return request<{ success: boolean; blog: any }>(
      `/api/blogs/${id}`,
      {},
      () => localStore.getBlogById(id)
    );
  },

  async createBlog(formData: FormData) {
    return request<{ success: boolean; message: string; blog: any }>(
      '/api/blogs',
      {
        method: 'POST',
        body: formData,
      },
      () => localStore.createBlog(formData)
    );
  },

  async updateBlog(id: string, formData: FormData) {
    return request<{ success: boolean; message: string; blog: any }>(
      `/api/blogs/${id}`,
      {
        method: 'PUT',
        body: formData,
      },
      () => localStore.updateBlog(id, formData)
    );
  },

  async deleteBlog(id: string) {
    return request<{ success: boolean; message: string }>(
      `/api/blogs/${id}`,
      {
        method: 'DELETE',
      },
      () => localStore.deleteBlog(id)
    );
  },

  async toggleLike(id: string) {
    return request<{ success: boolean; liked: boolean; likesCount: number }>(
      `/api/blogs/${id}/like`,
      {
        method: 'POST',
      },
      () => localStore.toggleLike(id)
    );
  },

  async toggleBookmark(id: string) {
    return request<{ success: boolean; bookmarked: boolean; message: string }>(
      `/api/blogs/${id}/bookmark`,
      {
        method: 'POST',
      },
      () => localStore.toggleBookmark(id)
    );
  },

  async getMyBookmarks() {
    return request<{ success: boolean; bookmarks: any[] }>(
      '/api/blogs/user/bookmarks',
      {},
      () => localStore.getMyBookmarks()
    );
  },

  async getAuthorDashboard() {
    return request<{ success: boolean; stats: any; blogs: any[] }>(
      '/api/blogs/user/dashboard',
      {},
      () => localStore.getAuthorDashboard()
    );
  },
};

// ---- CATEGORIES API ----
export const categoriesAPI = {
  async getCategories() {
    return request<{ success: boolean; categories: any[] }>(
      '/api/categories',
      {},
      () => localStore.getCategories()
    );
  },

  async createCategory(data: { name: string; description?: string }) {
    return request<{ success: boolean; message: string; category: any }>(
      '/api/categories',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      () => localStore.createCategory(data)
    );
  },

  async updateCategory(id: string, data: { name: string; description?: string }) {
    return request<{ success: boolean; message: string; category: any }>(
      `/api/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      () => localStore.updateCategory(id, data)
    );
  },

  async deleteCategory(id: string) {
    return request<{ success: boolean; message: string }>(
      `/api/categories/${id}`,
      {
        method: 'DELETE',
      },
      () => localStore.deleteCategory(id)
    );
  },
};

// ---- COMMENTS API ----
export const commentsAPI = {
  async getComments(blogId: string) {
    return request<{ success: boolean; comments: any[] }>(
      `/api/blogs/${blogId}/comments`,
      {},
      () => localStore.getComments(blogId)
    );
  },

  async createComment(blogId: string, text: string) {
    return request<{ success: boolean; message: string; comment: any }>(
      `/api/blogs/${blogId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      },
      () => localStore.createComment(blogId, text)
    );
  },

  async deleteComment(commentId: string) {
    return request<{ success: boolean; message: string }>(
      `/api/comments/${commentId}`,
      {
        method: 'DELETE',
      },
      () => localStore.deleteComment(commentId)
    );
  },
};

// ---- ADMIN API ----
export const adminAPI = {
  async getDashboard() {
    return request<{ success: boolean; stats: any }>(
      '/api/admin/dashboard',
      {},
      async () => {
        const stats = await localStore.getDashboardStats(null);
        return { success: true, stats };
      }
    );
  },

  async getUsers() {
    return request<{ success: boolean; users: any[] }>(
      '/api/admin/users',
      {},
      () => localStore.getUsers()
    );
  },

  async updateUserRole(userId: string, role: string) {
    return request<{ success: boolean; message: string; user: any }>(
      `/api/admin/users/${userId}/role`,
      {
        method: 'PUT',
        body: JSON.stringify({ role }),
      },
      () => localStore.updateUserRole(userId, role)
    );
  },

  async deleteUser(userId: string) {
    return request<{ success: boolean; message: string }>(
      `/api/admin/users/${userId}`,
      {
        method: 'DELETE',
      },
      () => localStore.deleteUser(userId)
    );
  },

  async getAllComments() {
    return request<{ success: boolean; comments: any[] }>(
      '/api/admin/comments',
      {},
      () => localStore.getAllComments()
    );
  },
};

// ---- SYSTEM HEALTH ----
export const systemAPI = {
  async getHealth() {
    return request<{ status: string; timestamp: string; database: any }>(
      '/api/health',
      {},
      async () => ({
        status: 'online',
        timestamp: new Date().toISOString(),
        database: { connected: false, type: 'local_storage_engine', uri: 'Client autonomous local store' },
      })
    );
  },
};
