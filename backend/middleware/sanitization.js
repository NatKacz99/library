import validator from 'validator';
import xss from 'xss';

export function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';

  str = str.trim();

  str = str.substring(0, maxLength);

  str = xss(str, {
    whiteList: {}, 
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
  
  return str;
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  
  email = email.trim().toLowerCase();
  
  email = validator.escape(email);
  
  return email;
}

export function sanitizeSearchTerm(search) {
  if (typeof search !== 'string') return '';

  search = search.trim().substring(0, 100);

  search = search.replace(/[<>\"']/g, '');

  search = search.replace(/\s+/g, ' ');
  
  return search;
}

export function sanitizeUserId(userId) {
  const parsed = parseInt(userId);
  
  if (parsed <= 0) {
    throw new Error('Invalid user ID');
  }
  
  return parsed;
}

export function sanitizeMiddleware(req, res, next) {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key], 200);
      }
    });
  }

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key], 500);
      }
    });
  }
  
  next();
}