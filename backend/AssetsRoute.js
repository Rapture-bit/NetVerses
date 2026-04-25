const AssetsRoute = [
  {
    name: "Image Placeholder",
    type: "server",
    urlPath: "/media/image_placeholder.jpg",
    filePath: "/images/default/placeholder.jpg",
  },
  {
    name: "Soviet Banner",
    type: "server",
    urlPath: "/uploads/banners/soviet_banner.jpg",
    filePath: "/images/uploads/soviet_banner.jpg",
  },
  {
    name: "Avatar Upload",
    urlPath: "/uploads/avatars/:filename",
    type: "server",
    filePath: "/images/uploads/avatars/:filename",
  },
  {
    name: "Image",
    type: "server",
    urlPath: "/media/image_1.jpg",
    filePath: "/images/default/image_1.jpg",
  },
  {
    name: "Image",
    type: "server",
    urlPath: "/media/image_2.jpg",
    filePath: "/images/default/image_2.webp",
  },
  {
    name: "Image",
    type: "server",
    urlPath: "/media/image_3.jpg",
    filePath: "/images/default/image_3.jpg",
  },
  {
    urlPath: "scripts/ga.js",
    type: "server",
    filePath: "/scripts/ga.js",
  },
];

export default AssetsRoute;
