import fs from 'fs';
import path from 'path';

class TemplateManager {
    constructor(templatesDir) {
        this.templatesDir = templatesDir;
    }

    loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, `${templateName}.json`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template ${templateName} does not exist.`);
        }
        return JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    }

    createTemplateStructure(template, targetDir) {
        // Create directories
        template.directories.forEach(dir => {
            const dirPath = path.join(targetDir, dir);
            fs.mkdirSync(dirPath, { recursive: true });
        });

        // Create files
        for (const [fileName, content] of Object.entries(template.files)) {
            const filePath = path.join(targetDir, fileName);
            fs.writeFileSync(filePath, content, 'utf8');
        }

        console.log(`Template ${template.name} created successfully in ${targetDir}`);
    }
}

export default TemplateManager;