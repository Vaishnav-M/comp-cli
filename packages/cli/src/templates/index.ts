/**
 * Templates Index
 */

export { SHARED_FILES } from './shared';
export { HERO_TEMPLATES } from './hero';
export { ABOUT_TEMPLATES } from './about';
export { CONTACT_TEMPLATES } from './contact';
export { BOOKING_TEMPLATES } from './booking';
export { FOOTER_TEMPLATES } from './footer';

export const SECTION_TEMPLATES: Record<string, Record<string, string>> = {
  hero: require('./hero').HERO_TEMPLATES,
  about: require('./about').ABOUT_TEMPLATES,
  contact: require('./contact').CONTACT_TEMPLATES,
  booking: require('./booking').BOOKING_TEMPLATES,
  footer: require('./footer').FOOTER_TEMPLATES,
};
