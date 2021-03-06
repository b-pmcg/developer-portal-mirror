import { useState } from 'react';
import { getGithubPreviewProps, parseJson } from 'next-tinacms-github';
import { useGithubJsonForm } from 'react-tinacms-github';
import Router from 'next/router';
import SingleLayout from '../layouts/SingleLayout.js';
import GuideList from '../components/GuideList';
import ArticlesList from '../components/ArticlesList';
import Link from 'next/link';
import PageLead from '../components/PageLead';
import CommunityCta from '../components/CommunityCta';
import SignupCta from '../components/SignupCta';
import { Container, jsx, Card, Heading, Text, Grid, Box, Flex, Link as ThemeLink } from 'theme-ui';
import { createToc, getGuides } from '@utils';
import { usePlugin } from 'tinacms';
import getGlobalStaticProps from '../utils/getGlobalStaticProps';
import { useGlobalStyleForm } from '@hooks';
import { default as featGuides } from '../data/featuredGuides.json';
import { Icon } from '@makerdao/dai-ui-icons';
// import Link from 'next/link';

const CodeBox = () => {
  const [activeTool, setActiveTool] = useState(0);

  const tools = [
    {
      title: 'Dai.js',
      des: 'the JS lib',
      code: 'hello world!',
    },
    {
      title: 'Data API',
      des: 'much GraphQL',
      code: 'data yo',
    },

    {
      title: 'pyMaker',
      des: 'python pything ',
      code: 'snippet',
    },
  ];
  return (
    <Container>
      <Grid
        columns={'1fr auto'}
        sx={{
          columnGap: 4,
        }}
      >
        <Box>
          <Card
            sx={{
              height: '500px',
              width: '100%',
              // bg: 'red',
            }}
          >
            <pre>{tools[activeTool].code}</pre>
          </Card>
        </Box>
        <Box sx={{}}>
          <Heading pb={4} variant="mediumHeading">
            Dive in the code
          </Heading>
          <Grid
            sx={{
              rowGap: 4,
            }}
          >
            {tools.map((tool, i) => {
              const { title, des } = tool;
              const isActive = i === activeTool;
              return (
                <Box>
                  <Heading
                    variant="microHeading"
                    onClick={() => {
                      setActiveTool(i);
                    }}
                  >
                    {title}
                  </Heading>
                  {!isActive ? null : (
                    <Grid
                      sx={{
                        rowGap: 2,
                        pt: 2,
                      }}
                    >
                      <Text>{des}</Text>
                      <Link href="/">
                        <Text>→ read more</Text>
                      </Link>
                    </Grid>
                  )}
                </Box>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};
const ModulesList = () => {
  const modules = [
    {
      title: 'Governance',
      description: 'all about gov',
      cta: '',
    },

    {
      title: 'Auctions',
      description: 'liquidations 101',
      cta: '',
    },
    {
      title: 'DSR',
      description: 'earn passively',
      cta: '',
    },
    {
      title: 'Oracles',
      description: 'all seeing',
      cta: '',
    },
    {
      title: 'Vaults',
      description: 'debt generation',
      cta: '',
    },
  ];
  return (
    <Container>
      <Grid
        columns={'1fr 1fr 1fr 1fr'}
        sx={{
          columnGap: 3,
          rowGap: 3,
        }}
      >
        {modules.map(({ title, description }) => {
          return (
            <Card key={title}>
              <Grid>
                <Heading>{title}</Heading>
                <Link href={`${title.toLowerCase()}`} passHref>
                  <Flex sx={{ alignItems: 'center' }}>
                    <Icon sx={{ mr: 2 }} name={'arrow_right'}></Icon>
                    <ThemeLink sx={{ color: 'text' }}>Learn More</ThemeLink>
                  </Flex>
                </Link>
              </Grid>
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
};

const IntroText = () => {
  return (
    <Container>
      <Heading
        sx={{
          pb: 4,
        }}
      >
        Maker Protocol is the technology behind MakerDAO, MakerDAO is a decentralized organization
        dedicated to bringing stability to the cryptocurrency economy. The Maker Protocol employs a
        two-token system. The first being, Dai, a collateral-backed stablecoin that offers
        stability.
      </Heading>
      <Text
        sx={{
          pb: 4,
          color: 'onBackgroundMuted',
          columns: '2 200px',
        }}
      >
        The Maker Foundation and the MakerDAO community believe that a decentralized stablecoin is
        required to have any business or individual realize the advantages of digital money. Second,
        there is MKR, a governance token that is used by stakeholders to maintain the system and
        manage Dai. MKR token holders are the decision-makers of the Maker Protocol, supported by
        the larger public community and various other external parties. Maker is unlocking the power
        of decentralized finance for everyone by creating an inclusive platform for economic
        empowerment; enabling everyone with equal access to the global financial marketplace.
      </Text>

      <Link href="/technology">
        <Text>→ Learn more about the technology.</Text>
      </Link>
    </Container>
  );
};
const Page = ({ file, preview, styleFile, guides }) => {
  console.log(guides, 'init');
  const initialGuides = guides;

  const formOptions = {
    label: 'home page',
    fields: [
      {
        name: 'title',
        component: 'text',
      },
    ],
  };
  const [data, form] = useGithubJsonForm(file, formOptions);
  usePlugin(form);
  const [styleData, styleForm] = useGlobalStyleForm(styleFile, preview);
  return (
    <SingleLayout>
      <PageLead />
      {/* <GuideList guides={[]} />
       */}

      <Grid
        sx={{
          rowGap: 6,
        }}
      >
        <ModulesList />
        <IntroText />
        <CodeBox />
        <ArticlesList title="Recent Guides" resources={initialGuides} />
        <CommunityCta />
        {/* <SignupCta /> */}
      </Grid>
    </SingleLayout>
  );
};

/**
 * Fetch data with getStaticProps based on 'preview' mode
 */
export const getStaticProps = async function ({ preview, previewData }) {
  const global = await getGlobalStaticProps(preview, previewData);

  const resources = await getGuides(preview, previewData, 'content/resources');
  const documentation = resources.filter((g) => g.data.frontmatter.contentType === 'documentation');
  const guides = resources.filter((g) => g.data.frontmatter.contentType === 'guide');

  if (preview) {
    // get data from github
    const file = (
      await getGithubPreviewProps({
        ...previewData,
        fileRelativePath: 'content/home.json',
        parse: parseJson,
      })
    ).props;

    return {
      props: {
        ...file,
        ...global,
      },
    };
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: 'content/home.json',
        data: (await import('../content/home.json')).default,
      },
      guides,
      documentation,
      ...global,
    },
  };
};

export default Page;
