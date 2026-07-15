import Banner from '../models/bannerModel.js';

const bannerController = {};

bannerController.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().populate('id_module', 'name');
    res.json({ data: banners });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error });
  }
};

bannerController.createBanner = async (req, res) => {
  try {
    const { id_module, active } = req.body;
    let image = '';
    
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    if (!id_module || !image) {
      return res.status(400).json({ message: "Module and image are required" });
    }

    const banner = new Banner({ id_module, image, active });
    await banner.save();
    res.status(201).json({ message: 'Banner created successfully', data: banner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error });
  }
};

bannerController.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_module, active } = req.body;
    let updateData = { id_module, active };
    
    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }
    
    const banner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner updated successfully', data: banner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error });
  }
};

bannerController.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error });
  }
};

export default bannerController;
