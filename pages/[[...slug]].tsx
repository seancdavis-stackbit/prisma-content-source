import { Page, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStaticPaths() {
  // Get page records from Prisma
  const pages = await prisma.page.findMany({
    select: {
      urlPath: true,
    },
  });

  // Map page records to paths
  const paths = pages.map((page) => ({
    params: { slug: page.urlPath === "/" ? [] : page.urlPath.split("/") },
  }));
  // const paths = pages.map((page) => page.urlPath);

  console.log(paths);

  // Return paths, fallback: false means pages that don't exist will 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log("getStaticProps");
  console.log({ params });

  // Get page record from Prisma
  const page = await prisma.page.findUnique({
    where: {
      urlPath: params.slug.join("/"),
    },
  });

  return { props: { page } };
}

export default function Home(props: { page: Page }) {
  const { page } = props;

  return <h1>{page.title}</h1>;
}
