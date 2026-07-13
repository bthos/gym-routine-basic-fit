#!/usr/bin/env node

/**
 * Validation script for BasicFit Equipment Catalog
 * Validates equipment.json against the JSON schema
 */

const fs = require('fs');
const path = require('path');

// Simple JSON schema validator (basic implementation)
// For production use, consider using ajv or similar library
function validateSchema(data, schema) {
  const errors = [];

  // Validate metadata
  if (!data.metadata) {
    errors.push('Missing required field: metadata');
    return errors;
  }

  const metadata = data.metadata;
  if (!metadata.lastUpdated) errors.push('metadata.lastUpdated is required');
  if (!metadata.source) errors.push('metadata.source is required');
  if (!Array.isArray(metadata.languages)) errors.push('metadata.languages must be an array');
  if (typeof metadata.totalEquipment !== 'number') {
    errors.push('metadata.totalEquipment must be a number');
  }

  // Validate equipment array
  if (!Array.isArray(data.equipment)) {
    errors.push('equipment must be an array');
    return errors;
  }

  // Validate each equipment item
  data.equipment.forEach((item, index) => {
    const prefix = `equipment[${index}]`;

    // Required fields
    const requiredFields = [
      'id', 'modelCode', 'series', 'category', 'muscleGroup',
      'names', 'descriptions', 'images', 'videos', 'manuals',
      'instructions', 'specifications', 'gyms'
    ];

    requiredFields.forEach(field => {
      if (!(field in item)) {
        errors.push(`${prefix}.${field} is required`);
      }
    });

    // Validate category
    const validCategories = ['chest', 'shoulders', 'back', 'arms', 'core', 'legs'];
    if (item.category && !validCategories.includes(item.category)) {
      errors.push(`${prefix}.category must be one of: ${validCategories.join(', ')}`);
    }

    // Validate names (bilingual)
    if (item.names) {
      if (!item.names.en) errors.push(`${prefix}.names.en is required`);
      if (!item.names.es) errors.push(`${prefix}.names.es is required`);
    }

    // Validate descriptions (bilingual)
    if (item.descriptions) {
      if (!item.descriptions.en) errors.push(`${prefix}.descriptions.en is required`);
      if (!item.descriptions.es) errors.push(`${prefix}.descriptions.es is required`);
    }

    // Validate instructions (bilingual)
    if (item.instructions) {
      if (!item.instructions.en) errors.push(`${prefix}.instructions.en is required`);
      if (!item.instructions.es) errors.push(`${prefix}.instructions.es is required`);
    }

    // Validate muscleGroup
    if (item.muscleGroup) {
      if (!Array.isArray(item.muscleGroup.primary)) {
        errors.push(`${prefix}.muscleGroup.primary must be an array`);
      }
      if (!Array.isArray(item.muscleGroup.secondary)) {
        errors.push(`${prefix}.muscleGroup.secondary must be an array`);
      }
    }

    // Validate images array
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((img, imgIndex) => {
        if (!img.url) errors.push(`${prefix}.images[${imgIndex}].url is required`);
        if (!img.source) errors.push(`${prefix}.images[${imgIndex}].source is required`);
        if (typeof img.isMain !== 'boolean') {
          errors.push(`${prefix}.images[${imgIndex}].isMain must be a boolean`);
        }
      });
    }

    // Validate videos (bilingual)
    if (item.videos) {
      ['en', 'es'].forEach(lang => {
        if (!Array.isArray(item.videos[lang])) {
          errors.push(`${prefix}.videos.${lang} must be an array`);
        } else {
          item.videos[lang].forEach((video, vidIndex) => {
            if (!video.url) errors.push(`${prefix}.videos.${lang}[${vidIndex}].url is required`);
            if (!video.type) errors.push(`${prefix}.videos.${lang}[${vidIndex}].type is required`);
            if (!video.title) errors.push(`${prefix}.videos.${lang}[${vidIndex}].title is required`);
          });
        }
      });
    }

    // Validate gyms array
    if (item.gyms && Array.isArray(item.gyms)) {
      item.gyms.forEach((gymId, gymIndex) => {
        if (typeof gymId !== 'number' || gymId < 1) {
          errors.push(`${prefix}.gyms[${gymIndex}] must be a positive integer`);
        }
      });
    }
  });

  return errors;
}

// Main validation function
function validate() {
  const dataPath = path.join(__dirname, '..', 'data', 'equipment.json');
  const schemaPath = path.join(__dirname, '..', 'data', 'schema', 'equipment.schema.json');

  console.log('Validating BasicFit Equipment Catalog...\n');

  // Read data file
  let data;
  try {
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(dataContent);
    console.log(`✓ Read equipment.json (${data.equipment.length} items)`);
  } catch (error) {
    console.error(`✗ Error reading equipment.json: ${error.message}`);
    process.exit(1);
  }

  // Read schema file
  let schema;
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    schema = JSON.parse(schemaContent);
    console.log('✓ Read equipment.schema.json');
  } catch (error) {
    console.error(`✗ Error reading schema: ${error.message}`);
    process.exit(1);
  }

  // Validate data
  console.log('\nValidating data structure...');
  const errors = validateSchema(data, schema);

  if (errors.length === 0) {
    console.log('✓ All validations passed!\n');
    console.log(`Summary:`);
    console.log(`  - Total equipment: ${data.equipment.length}`);
    console.log(`  - Languages: ${data.metadata.languages.join(', ')}`);
    console.log(`  - Last updated: ${data.metadata.lastUpdated}`);
    
    // Count by category
    const categories = {};
    data.equipment.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    console.log(`  - Categories:`);
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`    • ${cat}: ${count}`);
    });
    
    return 0;
  } else {
    console.error(`\n✗ Validation failed with ${errors.length} error(s):\n`);
    errors.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error}`);
    });
    return 1;
  }
}

// Run validation
if (require.main === module) {
  const exitCode = validate();
  process.exit(exitCode);
}

module.exports = { validate, validateSchema };
