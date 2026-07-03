const Blog = require('../models/Blog');

const getBlogs = async (req, res, next) => {
  try {
    const { search, destination, page = 1, limit = 10 } = req.query;
    const query = { isDeleted: false };

    if (search) query.$text = { $search: search };
    if (destination) query.destination = { $regex: destination, $options: 'i' };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isDeleted: false }).populate('userId', 'name bio');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Blog post published', data: blog });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post updated', data: blog });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? { _id: req.params.id } : { _id: req.params.id, userId: req.user._id };

    const blog = await Blog.findOneAndUpdate(
      { ...query, isDeleted: false },
      { isDeleted: true, deletedBy: isAdmin ? 'admin' : 'user' },
      { new: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    next(error);
  }
};

const getUserBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Blog.countDocuments({ userId: req.user._id, isDeleted: false });
    const blogs = await Blog.find({ userId: req.user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, getUserBlogs };
