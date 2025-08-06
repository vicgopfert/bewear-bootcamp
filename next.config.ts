import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Define os padrões de URLs remotas permitidas para carregar imagens externas via <Image />
    remotePatterns: [
      {
        protocol: "https", // Permite apenas URLs HTTPS
        hostname: "fsc-projects-static.s3.us-east-1.amazonaws.com", // Domínio autorizado para imagens externas
        pathname: "/**", // Permite qualquer caminho dentro deste domínio (qualquer pasta/arquivo)
      },
    ],
  },
};

export default nextConfig;
