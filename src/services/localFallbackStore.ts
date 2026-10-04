/**
 * In-Browser Local Storage Fallback Engine
 * Ensures 100% functionality even when deployed to Vercel (without backend),
 * offline, or when the Express backend is temporarily unreachable.
 */

const STORAGE_KEYS = {
  USERS: 'ink_quill_users_v2',
  BLOGS: 'ink_quill_blogs_v2',
  CATEGORIES: 'ink_quill_categories_v2',
  COMMENTS: 'ink_quill_comments_v2',
  BOOKMARKS: 'ink_quill_bookmarks_v2',
  CURRENT_USER_ID: 'ink_quill_current_user_id',
};

// Helper for generating unique MongoDB-style IDs
const genId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = 'xxxxxxxxxxxxxxxx'
    .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
    .toLowerCase();
  return (timestamp + random).slice(0, 24);
};

// Initial Seed Data
const getInitialSeed = () => {
  const adminId = '6601a1b2c3d4e5f678901234';
  const authorId = '6601a1b2c3d4e5f678901235';
  const userId = '6601a1b2c3d4e5f678901236';

  const catTechId = '6602a1b2c3d4e5f678901201';
  const catProgId = '6602a1b2c3d4e5f678901202';
  const catAiId = '6602a1b2c3d4e5f678901203';
  const catWebId = '6602a1b2c3d4e5f678901204';
  const catUiId = '6602a1b2c3d4e5f678901205';
  const catEduId = '6602a1b2c3d4e5f678901206';
  const catLifeId = '6602a1b2c3d4e5f678901207';

  const blog1Id = '6603a1b2c3d4e5f678901301';
  const blog2Id = '6603a1b2c3d4e5f678901302';
  const blog3Id = '6603a1b2c3d4e5f678901303';
  const blog4Id = '6603a1b2c3d4e5f678901304';
  const blog5Id = '6603a1b2c3d4e5f678901305';
  const blog6Id = '6603a1b2c3d4e5f678901306';
  const blog7Id = '6603a1b2c3d4e5f678901307';
  const blog8Id = '6603a1b2c3d4e5f678901308';

  return {
    users: [
      {
        _id: adminId,
        name: 'Eleanor Vance',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        profileImage: '/uploads/avatar_editorial_author_1791021230534.jpg',
        bio: 'Editor-in-chief & administrator. Writing about thoughtful engineering and editorial systems.',
        createdAt: '2026-01-15T09:00:00.000Z',
      },
      {
        _id: authorId,
        name: 'Julian Thorne',
        email: 'author@example.com',
        password: 'author123',
        role: 'user',
        profileImage: '/uploads/avatar_editorial_author_1791021230534.jpg',
        bio: 'Staff essayist and full-stack software engineer. Obsessed with readable prose and high-performance databases.',
        createdAt: '2026-02-01T10:30:00.000Z',
      },
      {
        _id: userId,
        name: 'Keerthana R.',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        profileImage: '/uploads/reader_avatar_portrait_1791096597464.jpg',
        bio: 'Lifelong learner exploring the modern MERN stack and clean web architectures.',
        createdAt: '2026-02-14T14:20:00.000Z',
      },
    ],
    categories: [
      { _id: catTechId, name: 'Technology', description: 'Computing trends, architecture, and system hardware.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catProgId, name: 'Programming', description: 'JavaScript, TypeScript, Node.js, and clean code techniques.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catAiId, name: 'Artificial Intelligence', description: 'Autonomous agents, neural architectures, and intelligent systems.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catWebId, name: 'Web Development', description: 'React, Express, REST APIs, and full-stack engineering.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catUiId, name: 'UI/UX', description: 'Typography, layout math, accessibility, and visual hierarchy.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catEduId, name: 'Education', description: 'Curriculum design, developer onboarding, and mentorship.', createdAt: '2026-01-01T00:00:00.000Z' },
      { _id: catLifeId, name: 'Lifestyle', description: 'Mindful productivity, slow writing, and focus rituals.', createdAt: '2026-01-01T00:00:00.000Z' },
    ],
    blogs: [
      {
        _id: blog1Id,
        title: 'The Art of the Monolith: Why Boring Tech Wins',
        content: `<h2>The Allure of Architectural Simplicity</h2><p>Software engineering often falls victim to the sirens of artificial complexity. We dismantle modular codebases into dozens of brittle microservices before finding product-market fit, only to spend working hours orchestrating distributed transactions and debugging network latency.</p><p>In this long-form reflection, we explore the enduring power of unified web services: <strong>Node.js, Express, and local databases</strong>. When built with discipline, a single repository and coherent data model can serve millions of requests with sub-millisecond query performance.</p><h3>Simplicity as an Explicit Feature</h3><p>Choosing proven tools like Express and MongoDB gives your team something invaluable: cognitive clarity.</p>`,
        author: authorId,
        category: catTechId,
        categoryName: 'Technology',
        tags: ['Architecture', 'Node.js', 'Engineering'],
        coverImage: '/uploads/monolith_servers_1791098652828.jpg',
        status: 'published',
        likes: [adminId, userId],
        createdAt: '2026-02-18T11:00:00.000Z',
        updatedAt: '2026-02-18T11:00:00.000Z',
      },
      {
        _id: blog2Id,
        title: 'Deep Work and the Morning Writing Ritual',
        content: `<h2>Cultivating Quiet Concentration</h2><p>Before the screen lights up with notifications and message pings, the morning holds a quiet sanctuary. For writers and engineers alike, cultivating an undisturbed block of time is the prerequisite for deep intellectual output.</p><blockquote>"The quality of your thinking directly mirrors the quality of your attention. Protect it fiercely."</blockquote>`,
        author: adminId,
        category: catLifeId,
        categoryName: 'Lifestyle',
        tags: ['Productivity', 'Rituals', 'Writing'],
        coverImage: '/uploads/morning_writing_desk_1791098667355.jpg',
        status: 'published',
        likes: [authorId],
        createdAt: '2026-02-22T08:30:00.000Z',
        updatedAt: '2026-02-22T08:30:00.000Z',
      },
      {
        _id: blog3Id,
        title: 'Modern Typography: Rhythm, Contrast, and Restraint',
        content: `<h2>Typography Beyond Font Selection</h2><p>Digital typography is not merely about selecting an appealing font family. It is an architectural discipline governed by geometry, visual rhythm, and reading ergonomics.</p><ul><li>Never wrap simple metadata into candy pill capsules.</li><li>Constrain reading line lengths to 65–75 characters per measure.</li><li>Establish contrast through optical size and line-height.</li></ul>`,
        author: authorId,
        category: catUiId,
        categoryName: 'UI/UX',
        tags: ['Design', 'Typography', 'Editorial'],
        coverImage: '/uploads/blog_design_craft_1791021191503.jpg',
        status: 'published',
        likes: [userId],
        createdAt: '2026-02-28T14:15:00.000Z',
        updatedAt: '2026-02-28T14:15:00.000Z',
      },
      {
        _id: blog4Id,
        title: 'Understanding MERN Stack Data Flow: From React to MongoDB',
        content: `<h2>Demystifying Full-Stack JavaScript</h2><p>To truly master the MERN stack, you must build an intuition for the complete request-response journey across all four tiers: <em>React Client &rarr; Express Routing &rarr; Mongoose Validation &rarr; Local MongoDB Engine</em>.</p>`,
        author: userId,
        category: catWebId,
        categoryName: 'Web Development',
        tags: ['React', 'Node.js', 'Express', 'MongoDB'],
        coverImage: '/uploads/blog_tech_future_1791021180515.jpg',
        status: 'published',
        likes: [adminId, authorId, userId],
        createdAt: '2026-03-01T16:00:00.000Z',
        updatedAt: '2026-03-01T16:00:00.000Z',
      },
      {
        _id: blog5Id,
        title: 'Autonomous Intelligence & Human Agency in Software',
        content: `<h2>Balancing Autonomy with Clarity</h2><p>As autonomous reasoning agents transition from experimental research labs to everyday software systems, engineers face a profound philosophical crossroad: how do we empower automated intelligence while fiercely preserving user agency and explainability?</p><h3>Transparent System Boundaries</h3><p>Autonomous software should never masquerade as human intuition. It must declare its operational assumptions, cite its reasoning traces, and offer graceful manual overrides at every critical juncture.</p>`,
        author: authorId,
        category: catAiId,
        categoryName: 'Artificial Intelligence',
        tags: ['AI', 'Ethics', 'Autonomy', 'Systems'],
        coverImage: '/uploads/ai_ethics_future_1791098680461.jpg',
        status: 'published',
        likes: [adminId, authorId],
        createdAt: '2026-03-02T10:00:00.000Z',
        updatedAt: '2026-03-02T10:00:00.000Z',
      },
      {
        _id: blog6Id,
        title: 'The Architecture of Offline-First Web Systems',
        content: `<h2>Local Resilience as Standard Practice</h2><p>Building applications that function flawlessly without an active internet connection transforms web apps from fragile network consumers into robust personal instruments.</p><p>By combining service workers, local IndexedDB caches, and optimistic UI mutations, a modern MERN app can operate in airplane cabins, remote rural areas, or intermittent college Wi-Fi networks without dropping a single keystroke.</p>`,
        author: userId,
        category: catProgId,
        categoryName: 'Programming',
        tags: ['Offline', 'LocalFirst', 'IndexedDB', 'Architecture'],
        coverImage: '/uploads/blog_offline_arch_1791096611080.jpg',
        status: 'published',
        likes: [adminId, userId],
        createdAt: '2026-03-03T11:30:00.000Z',
        updatedAt: '2026-03-03T11:30:00.000Z',
      },
      {
        _id: blog7Id,
        title: 'Slow Computing: The Deliberate Engineer\'s Handbook',
        content: `<h2>Craft Over Perpetual Urgency</h2><p>In a culture intoxicated by rapid releases and perpetual urgency, slow computing is a quiet rebellion. It is the conscious decision to value correctness over speed, craftsmanship over churn, and intellectual depth over fleeting trends.</p><p>When we slow down our design phase, write comprehensive tests, and honor simplicity, we produce software that endures for decades rather than months.</p>`,
        author: adminId,
        category: catLifeId,
        categoryName: 'Lifestyle',
        tags: ['SlowTech', 'Mindfulness', 'Craft', 'Philosophy'],
        coverImage: '/uploads/blog_lifestyle_tea_1791021203342.jpg',
        status: 'published',
        likes: [authorId, userId],
        createdAt: '2026-03-04T09:15:00.000Z',
        updatedAt: '2026-03-04T09:15:00.000Z',
      },
      {
        _id: blog8Id,
        title: 'The Renaissance of Independent Web Publishing',
        content: `<h2>Reclaiming the Independent Web</h2><p>The centralized platforms of the 2010s promised boundless audience reach, but delivered algorithmic fatigue, intrusive tracking, and rented audiences. Today, a new renaissance is underway.</p><p>Writers, essayists, and engineers are rediscovering the dignity of personal blogs, bespoke typography, and self-hosted publishing platforms.</p>`,
        author: authorId,
        category: catEduId,
        categoryName: 'Education',
        tags: ['Publishing', 'Web', 'Writing', 'IndieWeb'],
        coverImage: '/uploads/hero_editorial_workspace_1791021169224.jpg',
        status: 'published',
        likes: [adminId, authorId, userId],
        createdAt: '2026-03-05T14:00:00.000Z',
        updatedAt: '2026-03-05T14:00:00.000Z',
      },
    ],
    comments: [
      {
        _id: '6604a1b2c3d4e5f678901401',
        blog: blog1Id,
        user: userId,
        text: 'This article resonated deeply. A clean Express and MongoDB setup gives so much peace of mind.',
        createdAt: '2026-02-19T09:30:00.000Z',
      },
      {
        _id: '6604a1b2c3d4e5f678901402',
        blog: blog1Id,
        user: adminId,
        text: 'Magnificent synthesis, Julian. Clean architecture always outlives passing trends.',
        createdAt: '2026-02-20T12:00:00.000Z',
      },
    ],
    bookmarks: [
      {
        _id: '6605a1b2c3d4e5f678901501',
        user: userId,
        blog: blog1Id,
        createdAt: '2026-02-20T10:00:00.000Z',
      },
    ],
  };
};

// Storage Helper Functions
const getFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Local storage save error:', err);
  }
};

// Initialize Storage
const initStore = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const seed = getInitialSeed();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seed.users));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(seed.categories));
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(seed.blogs));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(seed.comments));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(seed.bookmarks));
  } else {
    // Migration: ensure every user and blog has an image and 8 distinct articles
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    let usersUpdated = false;
    users.forEach((u) => {
      if (!u.profileImage) {
        u.profileImage = u.email === 'user@example.com'
          ? '/uploads/reader_avatar_portrait_1791096597464.jpg'
          : '/uploads/avatar_editorial_author_1791021230534.jpg';
        usersUpdated = true;
      }
    });
    if (usersUpdated) saveToStorage(STORAGE_KEYS.USERS, users);

    const seed = getInitialSeed();
    const existingBlogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const existingIds = new Set(existingBlogs.map((b) => b._id));
    const newBlogsToAdd = seed.blogs.filter((b) => !existingIds.has(b._id));
    let mergedBlogs = [...existingBlogs, ...newBlogsToAdd];

    // Ensure seed blogs have their designated unique cover image
    mergedBlogs = mergedBlogs.map((b) => {
      const seedMatch = seed.blogs.find((sb) => sb._id === b._id);
      if (seedMatch && seedMatch.coverImage) {
        return { ...b, coverImage: seedMatch.coverImage, status: 'published' };
      }
      return b;
    });

    saveToStorage(STORAGE_KEYS.BLOGS, mergedBlogs);
  }
};

initStore();

// Autonomous In-Browser MERN Operations
export const localStore = {
  // ---- AUTH ----
  async register(name: string, email: string, password: string) {
    initStore();
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const cleanEmail = email.toLowerCase().trim();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      _id: genId(),
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'user',
      profileImage: '',
      profileImageFilename: '',
      bio: 'Author and reader on Ink & Quill.',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser._id);

    const token = `local_jwt_${newUser._id}_${Date.now()}`;
    const { password: _, ...safeUser } = newUser;
    return { success: true, message: 'Registration successful.', token, user: safeUser };
  },

  async login(email: string, password: string) {
    initStore();
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password credentials.');
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user._id);
    const token = `local_jwt_${user._id}_${Date.now()}`;
    const { password: _, ...safeUser } = user;
    return { success: true, message: 'Login successful.', token, user: safeUser };
  },

  async getMe() {
    initStore();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u._id === currentId);

    if (!user) {
      throw new Error('User not found in storage.');
    }

    const stats = await this.getDashboardStats(user._id);
    const { password: _, ...safeUser } = user;
    return { success: true, user: { ...safeUser, stats } };
  },

  async updateProfile(data: { name?: string; bio?: string; profileImage?: string; profileImageFilename?: string }) {
    initStore();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u._id === currentId);

    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveToStorage(STORAGE_KEYS.USERS, users);
      const { password: _, ...safeUser } = users[idx];
      return { success: true, message: 'Profile updated successfully.', user: safeUser };
    }
    throw new Error('User not found.');
  },

  async uploadProfileImage(file: File) {
    return new Promise<{ success: boolean; message: string; imageUrl: string; filename: string; user: any }>(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Url = reader.result as string;
          const filename = `profile_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          try {
            const res = await localStore.updateProfile({
              profileImage: base64Url,
              profileImageFilename: filename,
            });
            resolve({
              success: true,
              message: 'Profile image updated successfully.',
              imageUrl: base64Url,
              filename,
              user: res.user,
            });
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      }
    );
  },

  // ---- BLOGS ----
  async getBlogs(params: { search?: string; category?: string; tag?: string; status?: string } = {}) {
    initStore();
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);

    let filtered = [...blogs];

    if (params.status && params.status !== 'all') {
      filtered = filtered.filter((b) => b.status === params.status);
    }
    if (params.category && params.category !== 'all') {
      const catLower = params.category.toLowerCase();
      filtered = filtered.filter(
        (b) => b.category === params.category || b.categoryName?.toLowerCase() === catLower
      );
    }
    if (params.tag) {
      filtered = filtered.filter((b) => b.tags?.some((t: string) => t.toLowerCase() === params.tag?.toLowerCase()));
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(s) ||
          b.content?.toLowerCase().includes(s) ||
          b.categoryName?.toLowerCase().includes(s) ||
          b.tags?.some((t: string) => t.toLowerCase().includes(s))
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Populate
    const populated = filtered.map((b) => {
      const author = users.find((u) => u._id === b.author);
      const cat = categories.find((c) => c._id === b.category);
      return {
        ...b,
        author: author
          ? { _id: author._id, name: author.name, email: author.email, profileImage: author.profileImage, role: author.role }
          : { _id: b.author, name: 'Author' },
        category: cat ? { _id: cat._id, name: cat.name } : { name: b.categoryName || 'General' },
      };
    });

    return { success: true, blogs: populated, total: populated.length, page: 1, totalPages: 1 };
  },

  async getBlogById(id: string) {
    initStore();
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

    const blog = blogs.find((b) => b._id === id);
    if (!blog) throw new Error('Blog post not found.');

    const author = users.find((u) => u._id === blog.author);
    const cat = categories.find((c) => c._id === blog.category);
    const bookmarks = getFromStorage<any[]>(STORAGE_KEYS.BOOKMARKS, []);

    const isBookmarked = currentId ? bookmarks.some((bm) => bm.user === currentId && bm.blog === id) : false;
    const isLiked = currentId && Array.isArray(blog.likes) ? blog.likes.includes(currentId) : false;

    return {
      success: true,
      blog: {
        ...blog,
        author: author
          ? { _id: author._id, name: author.name, email: author.email, profileImage: author.profileImage, role: author.role, bio: author.bio }
          : { _id: blog.author, name: 'Author' },
        category: cat ? { _id: cat._id, name: cat.name, description: cat.description } : { name: blog.categoryName || 'General' },
        likesCount: Array.isArray(blog.likes) ? blog.likes.length : 0,
        isLiked,
        isBookmarked,
      },
    };
  },

  async createBlog(formData: FormData) {
    initStore();
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';

    const title = (formData.get('title') as string) || '';
    const content = (formData.get('content') as string) || '';
    const category = (formData.get('category') as string) || '';
    const categoryName = (formData.get('categoryName') as string) || 'General';
    const status = (formData.get('status') as string) || 'published';
    const tagsRaw = formData.get('tags');
    const tags = typeof tagsRaw === 'string' ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

    // Process image file if present
    const imageFile = formData.get('coverImage');
    let coverImageUrl = '';

    if (imageFile instanceof File) {
      coverImageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(imageFile);
      });
    } else if (typeof imageFile === 'string') {
      coverImageUrl = imageFile;
    }

    const newBlog = {
      _id: genId(),
      title,
      content,
      author: currentId,
      category,
      categoryName,
      tags,
      coverImage: coverImageUrl || '/uploads/hero_editorial_workspace_1791021169224.jpg',
      status,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    blogs.unshift(newBlog);
    saveToStorage(STORAGE_KEYS.BLOGS, blogs);

    return { success: true, message: 'Article created successfully.', blog: newBlog };
  },

  async updateBlog(id: string, formData: FormData) {
    initStore();
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const idx = blogs.findIndex((b) => b._id === id);
    if (idx === -1) throw new Error('Blog not found.');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const categoryName = formData.get('categoryName') as string;
    const status = formData.get('status') as string;
    const tagsRaw = formData.get('tags');
    const tags = typeof tagsRaw === 'string' ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : undefined;

    const imageFile = formData.get('coverImage');
    let coverImageUrl: string | undefined = undefined;

    if (imageFile instanceof File) {
      coverImageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(imageFile);
      });
    } else if (typeof imageFile === 'string' && imageFile) {
      coverImageUrl = imageFile;
    }

    blogs[idx] = {
      ...blogs[idx],
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(category ? { category } : {}),
      ...(categoryName ? { categoryName } : {}),
      ...(status ? { status } : {}),
      ...(tags ? { tags } : {}),
      ...(coverImageUrl ? { coverImage: coverImageUrl } : {}),
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.BLOGS, blogs);
    return { success: true, message: 'Article updated successfully.', blog: blogs[idx] };
  },

  async deleteBlog(id: string) {
    initStore();
    let blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    blogs = blogs.filter((b) => b._id !== id);
    saveToStorage(STORAGE_KEYS.BLOGS, blogs);
    return { success: true, message: 'Article deleted successfully.' };
  },

  async toggleLike(blogId: string) {
    initStore();
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';
    const blog = blogs.find((b) => b._id === blogId);
    if (!blog) throw new Error('Blog not found.');

    if (!Array.isArray(blog.likes)) blog.likes = [];
    const index = blog.likes.indexOf(currentId);
    let liked = false;
    if (index === -1) {
      blog.likes.push(currentId);
      liked = true;
    } else {
      blog.likes.splice(index, 1);
      liked = false;
    }

    saveToStorage(STORAGE_KEYS.BLOGS, blogs);
    return { success: true, liked, likesCount: blog.likes.length };
  },

  async toggleBookmark(blogId: string) {
    initStore();
    const bookmarks = getFromStorage<any[]>(STORAGE_KEYS.BOOKMARKS, []);
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';

    const idx = bookmarks.findIndex((bm) => bm.user === currentId && bm.blog === blogId);
    let bookmarked = false;

    if (idx !== -1) {
      bookmarks.splice(idx, 1);
      bookmarked = false;
    } else {
      bookmarks.push({ _id: genId(), user: currentId, blog: blogId, createdAt: new Date().toISOString() });
      bookmarked = true;
    }

    saveToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return { success: true, bookmarked, message: bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks' };
  },

  async getMyBookmarks() {
    initStore();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';
    const bookmarks = getFromStorage<any[]>(STORAGE_KEYS.BOOKMARKS, []);
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);

    const userBms = bookmarks.filter((bm) => bm.user === currentId);
    const populated = userBms
      .map((bm) => {
        const blog = blogs.find((b) => b._id === bm.blog);
        if (!blog) return null;
        const author = users.find((u) => u._id === blog.author);
        return {
          ...blog,
          author: author ? { _id: author._id, name: author.name, profileImage: author.profileImage } : null,
        };
      })
      .filter(Boolean);

    return { success: true, bookmarks: populated };
  },

  async getAuthorDashboard() {
    initStore();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);

    const userBlogs = blogs.filter((b) => b.author === currentId);
    const populated = userBlogs.map((b) => {
      const cat = categories.find((c) => c._id === b.category);
      return {
        ...b,
        category: cat ? { _id: cat._id, name: cat.name } : { name: b.categoryName || 'General' },
      };
    });

    const stats = await this.getDashboardStats(currentId);
    return { success: true, stats, blogs: populated };
  },

  // ---- CATEGORIES ----
  async getCategories() {
    initStore();
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);
    return { success: true, categories };
  },

  async createCategory(data: { name: string; description?: string }) {
    initStore();
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);
    const newCat = {
      _id: genId(),
      name: data.name.trim(),
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };
    categories.push(newCat);
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return { success: true, message: 'Category created.', category: newCat };
  },

  async updateCategory(id: string, data: { name: string; description?: string }) {
    initStore();
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);
    const idx = categories.findIndex((c) => c._id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...data };
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      return { success: true, message: 'Category updated.', category: categories[idx] };
    }
    throw new Error('Category not found.');
  },

  async deleteCategory(id: string) {
    initStore();
    let categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);
    categories = categories.filter((c) => c._id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return { success: true, message: 'Category deleted.' };
  },

  // ---- COMMENTS ----
  async getComments(blogId: string) {
    initStore();
    const comments = getFromStorage<any[]>(STORAGE_KEYS.COMMENTS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);

    const blogComments = comments.filter((c) => c.blog === blogId);
    blogComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const populated = blogComments.map((c) => {
      const user = users.find((u) => u._id === c.user);
      return {
        ...c,
        user: user
          ? { _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, role: user.role }
          : { _id: c.user, name: 'Reader' },
      };
    });

    return { success: true, comments: populated };
  },

  async createComment(blogId: string, text: string) {
    initStore();
    const comments = getFromStorage<any[]>(STORAGE_KEYS.COMMENTS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || '6601a1b2c3d4e5f678901235';

    const newComment = {
      _id: genId(),
      blog: blogId,
      user: currentId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    comments.unshift(newComment);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);

    const user = users.find((u) => u._id === currentId);
    return {
      success: true,
      message: 'Comment posted.',
      comment: {
        ...newComment,
        user: user ? { _id: user._id, name: user.name, profileImage: user.profileImage, role: user.role } : null,
      },
    };
  },

  async deleteComment(commentId: string) {
    initStore();
    let comments = getFromStorage<any[]>(STORAGE_KEYS.COMMENTS, []);
    comments = comments.filter((c) => c._id !== commentId);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    return { success: true, message: 'Comment deleted.' };
  },

  // ---- ADMIN ----
  async getDashboardStats(userId: string | null = null) {
    initStore();
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);
    const comments = getFromStorage<any[]>(STORAGE_KEYS.COMMENTS, []);
    const bookmarks = getFromStorage<any[]>(STORAGE_KEYS.BOOKMARKS, []);
    const categories = getFromStorage<any[]>(STORAGE_KEYS.CATEGORIES, []);

    if (userId) {
      const userBlogs = blogs.filter((b) => b.author === userId);
      const published = userBlogs.filter((b) => b.status === 'published').length;
      const drafts = userBlogs.filter((b) => b.status === 'draft').length;
      const blogIds = new Set(userBlogs.map((b) => b._id));
      const totalLikes = userBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
      const totalComments = comments.filter((c) => blogIds.has(c.blog)).length;
      const totalBookmarks = bookmarks.filter((bm) => bm.user === userId).length;

      return {
        totalBlogs: userBlogs.length,
        publishedBlogs: published,
        draftBlogs: drafts,
        totalLikes,
        totalComments,
        totalBookmarks,
      };
    } else {
      const published = blogs.filter((b) => b.status === 'published').length;
      const drafts = blogs.filter((b) => b.status === 'draft').length;
      const totalLikes = blogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);

      return {
        totalUsers: users.length,
        totalBlogs: blogs.length,
        publishedBlogs: published,
        draftBlogs: drafts,
        totalComments: comments.length,
        totalLikes,
        totalCategories: categories.length,
      };
    }
  },

  async getUsers() {
    initStore();
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    return { success: true, users: users.map(({ password: _, ...u }) => u) };
  },

  async updateUserRole(userId: string, role: string) {
    initStore();
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u._id === userId);
    if (idx !== -1) {
      users[idx].role = role;
      saveToStorage(STORAGE_KEYS.USERS, users);
      return { success: true, message: 'Role updated.', user: users[idx] };
    }
    throw new Error('User not found.');
  },

  async deleteUser(userId: string) {
    initStore();
    let users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    users = users.filter((u) => u._id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return { success: true, message: 'User deleted.' };
  },

  async getAllComments() {
    initStore();
    const comments = getFromStorage<any[]>(STORAGE_KEYS.COMMENTS, []);
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const blogs = getFromStorage<any[]>(STORAGE_KEYS.BLOGS, []);

    const populated = comments.map((c) => {
      const u = users.find((user) => user._id === c.user);
      const b = blogs.find((blog) => blog._id === c.blog);
      return {
        ...c,
        user: u ? { _id: u._id, name: u.name, email: u.email } : { name: 'User' },
        blog: b ? { _id: b._id, title: b.title } : { title: 'Article' },
      };
    });

    return { success: true, comments: populated };
  },
};
