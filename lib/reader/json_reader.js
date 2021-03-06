/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const FileUtils = require('../utils/file_utils');
const JSONParser = require('../parser/json_parser');
const JSONFileReader = require('../reader/json_file_reader');

module.exports = {
  parseFromDir
};

/* Parse the given jhipster app dir and return a JDLObject */
function parseFromDir(dir) {
  if (!dir) {
    throw new Error('The app directory must be passed to read JSON files.');
  }
  if (!FileUtils.doesDirectoryExist(dir)) {
    throw new Error(`The passed directory '${dir}' must exist and must be a directory to read JSON files.`);
  }
  const entityDir = `${dir}/.jhipster`;
  if (!FileUtils.doesDirectoryExist(entityDir)) {
    throw new Error(`'${entityDir}' must exist as a directory.`);
  }
  const entities = {};
  const files = fs.readdirSync(entityDir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const entityName = file.slice(0, file.length - 5);
      try {
        entities[entityName] = JSONFileReader.readEntityJSON(`${entityDir}/${file}`);
      } catch (error) {
        // Not an entity file, not adding
      }
    }
  });
  const jdl = JSONParser.parseServerOptions(JSONFileReader.readEntityJSON(`${dir}/.yo-rc.json`)['generator-jhipster']);
  JSONParser.parseEntities(entities, jdl);
  return jdl;
}
