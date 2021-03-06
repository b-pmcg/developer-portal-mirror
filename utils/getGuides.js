import matter from 'gray-matter';
import {
  getFiles as getGithubFiles,
  getGithubPreviewProps,
  parseMarkdown,
} from 'next-tinacms-github';

const GetGuides = async (preview, previewData, contentDir) => {
  const fs = require('fs');
  const files = preview
    ? await getGithubFiles(
        contentDir,
        previewData.working_repo_full_name,
        previewData.head_branch,
        previewData.github_access_token
      )
    : await getLocalFiles(contentDir);

  const guides = await Promise.all(
    files.map(async (file) => {
      if (preview) {
        const previewProps = await getGithubPreviewProps({
          ...previewData,
          fileRelativePath: file,
          parse: parseMarkdown,
        });
        return {
          fileName: file.substring(contentDir.length + 1, file.length - 3),
          fileRelativePath: file,
          data: previewProps.props.file?.data,
        };
      }
      const content = fs.readFileSync(`${file}`, 'utf8');
      const data = matter(content);

      return {
        fileName: file.substring(contentDir.length + 1, file.length - 3),
        fileRelativePath: file,
        data: {
          frontmatter: data.data,
          markdownBody: data.content,
        },
      };
    })
  );
  return guides;
};

const getLocalFiles = async (filePath) => {
  console.log('This is the filepath we try to glob in getGuides:', `${filePath}/**/*.md`);
  // grab all md files
  const fg = require('fast-glob');
  const files = await fg(`${filePath}/**/*.md`);
  return files;
};

export default GetGuides;
