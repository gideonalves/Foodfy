// const db = require('../../config/db')
const fs = require('fs')

const Base = require('./Base');

Base.init({ table: 'files' });

module.exports = {
    ...Base,
}