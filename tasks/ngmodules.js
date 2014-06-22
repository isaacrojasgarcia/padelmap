var path = require('path');

module.exports = function (grunt) {
    grunt.registerMultiTask('ngmodules', 'Append modules.', function () {
        var self = this;
        var contents = [];
        var banner = "(function () {\n" +
            "\tangular.module('olaf." + self.target + "', [\n";
        var footer = "]);\n" +
            "})();\n";
        // Iterate over all src-dest file pairs.
        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                    contents.push(grunt.file.read(filepath));
                    return "\t\t'olaf." + self.target + "." + path.basename(filepath, '.js') + "'";
                });

            grunt.file.write(f.dest, banner + src.join(',\n') + footer + contents.join('\n'));
        });
    });
}