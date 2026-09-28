declare module '*.css';
declare module '*.scss';
declare module '*.module.scss' {
  const classes: { [className: string]: string };
  export default classes;
}
declare module 'modern-normalize';
declare module '*.png' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.jpg' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.jpeg' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.gif' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.webp' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.avif' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.bmp' {
  const assetUrl: string;
  export default assetUrl;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.eot' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.otf' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.ttf' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.woff' {
  const assetUrl: string;
  export default assetUrl;
}
declare module '*.woff2' {
  const assetUrl: string;
  export default assetUrl;
}
