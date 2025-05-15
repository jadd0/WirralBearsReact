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
  maxSize: 4 * 1024 * 1024, // 4MB
  accept: {
    'image/*': [],
  },
};
