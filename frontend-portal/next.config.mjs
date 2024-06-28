import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) =>
        {
            // config.resolve.alias = {
            //     '@utils': path.resolve(__dirname, './utils'),
            // };

            // config.module.rules.forEach((rule) => {
            //     if (rule.test && rule.test.toString().includes('scss')) {
            //       rule.use.forEach((use) => {
            //         if (use.loader && use.loader.includes('sass-loader')) {
            //           use.options = {
            //             ...use.options,
            //             sassOptions: {
            //               includePaths: [path.resolve(__dirname, 'utils')],
            //               // Add other paths if necessary
            //             },
            //             additionalData: `
            //               @import "utils/variables";
            //             `,
            //           };
            //         }
            //       });
            //     }
            // });
            return config;
        }
};

export default nextConfig;
