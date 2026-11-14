// Property shape used by the PDF flyer (from PropScribe AI), plus a helper that builds it
// from a Listing Studio client record and its generated copy.
import { ClientRecord } from './types';

export interface PropertySample {
  id: string;
  title: string;
  propertyType: string;
  price: string;
  location: string;
  specs: {
    beds: number;
    baths: number;
    sqft: number;
    lotSize: string;
    yearBuilt: number;
  };
  features: string[];
  imageUrl: string;
  multimodalTags: {
    room: string;
    style: string;
    keyAssets: string[];
    lighting: string;
  };
  mlsDescription: string;
  mlsShort: string;
  luxuryVariant: string;
  seoKeywords: {
    primary: string[];
    secondary: string[];
    hyperLocal: string[];
  };
  socialPosts: {
    instagram: string;
    facebook: string;
    linkedin: string;
    videoScript: string;
  };
}

// Neutral placeholder photo (inline SVG) until listing photos are uploaded
const PLACEHOLDER_PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><path d="M400 120 250 240v130h100v-80h100v80h100V240z" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="10" stroke-linejoin="round"/><text x="400" y="420" fill="#fff" fill-opacity=".75" font-family="sans-serif" font-size="22" text-anchor="middle">Listing photo</text></svg>`
  );

const firstNumber = (text: string, pattern: RegExp) => {
  const m = text.match(pattern);
  return m ? parseFloat(m[1]) : 0;
};

export function clientToFlyerProperty(client: ClientRecord, copy: string): PropertySample {
  return {
    id: client.id,
    title: client.property.replace(/\s*\(.*\)\s*$/, '') || client.property,
    propertyType: client.subtitle || 'Residential Listing',
    price: 'Contact for pricing',
    location: client.property,
    specs: {
      beds: firstNumber(client.beds, /(\d+(?:\.\d+)?)\s*(?:bed|room)/i),
      baths: firstNumber(client.beds, /(\d+(?:\.\d+)?)\s*bath/i),
      sqft: parseInt(client.sqft.replace(/[^\d]/g, ''), 10) || 0,
      lotSize: '',
      yearBuilt: 0,
    },
    features: client.features.split(/[,;]\s*/).map(f => f.trim()).filter(Boolean).slice(0, 6),
    imageUrl: PLACEHOLDER_PHOTO,
    multimodalTags: { room: '', style: '', keyAssets: [], lighting: '' },
    mlsDescription: copy,
    mlsShort: '',
    luxuryVariant: '',
    seoKeywords: { primary: [], secondary: [], hyperLocal: [] },
    socialPosts: { instagram: '', facebook: '', linkedin: '', videoScript: '' },
  };
}
