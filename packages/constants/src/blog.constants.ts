export const ELEMENT_CONSTRAINTS = {
  heading: {
    maxLength: 50,
  },
  paragraph: {
    maxLength: 500,
  },
};

export const ELEMENT_LABELS = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  image: 'Image',
};

export const IMAGE_UPLOAD_CONFIG = {
  maxFiles: 1,
  maxSize: 20 * 1024 * 1024, // 20MB
  accept: {
    'image/*': [],
  },
  multiple: false,
};

export const POST_IMAGE_CLOUD_ID_LENGTH = 13;


export const BLOG_ID_LENGTH = 7;
export const BLOG_MAX_TITLE_LENGTH = 50;
export const BLOG_MAX_PARAGRAPH_LENGTH = 500;
export const BLOG_MAX_HEADING_LENGTH = 50;

// ## IMAGES
export const BLOG_IMAGE_MIN_COUNT = 1;
export const BLOG_IMAGE_MAX_COUNT = 10;
export const BLOG_IMAGE_MAX_FILE_SIZE = 1024 * 1024 * 20; // 20MB