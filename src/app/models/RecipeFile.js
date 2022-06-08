const Base = require('./Base');

Base.init({ table: 'recipe_files' });

const { date } = require('../../lib/utils')

module.exports = {
    ...Base,
}