import { Page, PrismaClient } from "@prisma/client";
import { GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("getStaticProps");
  console.log({ params });

  let slug = params?.slug || [];
  if (typeof slug === "string") slug = [slug];
  if (slug.length === 0) slug = ["/"];

  // Get page record from Prisma
  const page = await prisma.page.findUnique({
    where: {
      urlPath: slug.join("/"),
    },
  });

  if (!page) {
    return { notFound: true };
  }

  return { props: { page } };
};

export default function Home(props: { page: Page }) {
  const { page } = props;

  return <h1>{page.title}</h1>;
}
