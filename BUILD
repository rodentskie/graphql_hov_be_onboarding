load("@build_bazel_rules_nodejs//:index.bzl", "npm_package_bin", "nodejs_test")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package(default_visibility = ["//visibility:public"])


deps = [
    "@npm//@graphql-tools/schema",
    "@npm//@graphql-tools/utils",
    "@npm//apollo-server-errors",
    "@npm//apollo-server-koa",
    "@npm//bcrypt",
    "@npm//chai",
    "@npm//class-validator",
    "@npm//dotenv",
    "@npm//faker",
    "@npm//graphql",
    "@npm//graphql-scalars",
    "@npm//jsonwebtoken",
    "@npm//koa",
    "@npm//mocha",
    "@npm//mongoose",
    "@npm//ramda",
    "@npm//reflect-metadata",
    "@npm//supertest",
]

type_deps = [
    "@npm//@types/bcrypt",
    "@npm//@types/chai",
    "@npm//@types/dotenv",
    "@npm//@types/faker",
    "@npm//@types/jsonwebtoken",
    "@npm//@types/koa",
    "@npm//@types/mocha",
    "@npm//@types/mongoose",
    "@npm//@types/ramda",
    "@npm//@types/supertest",
]

dev_deps = [
    "@npm//@bazel/typescript",
    "@npm//@commitlint/cli",
    "@npm//@commitlint/config-conventional",
    "@npm//@typescript-eslint/eslint-plugin",
    "@npm//@typescript-eslint/parser",
    "@npm//eslint",
    "@npm//eslint-config-airbnb-typescript",
    "@npm//eslint-config-prettier",
    "@npm//eslint-plugin-import",
    "@npm//eslint-plugin-prettier",
    "@npm//husky",
    "@npm//prettier",
    "@npm//ts-node",
    "@npm//typescript",
]

ts_config(
    name = "config",
    src = "tsconfig.json"
)

ts_project(
    name = "build",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*spec.ts",
            "tests/**/*.*",
            "node_modules/**/*.*",
        ],
    ),
    declaration = True,
    declaration_map = True,
    source_map = True,
    tsconfig = "tsconfig.json",
    deps = deps + type_deps + dev_deps,
)

npm_package_bin(
    name = "lint",
    args = [
        ".",
        "--ext .ts",
    ],
    data = glob(["**/*.ts"]) + deps + type_deps + dev_deps + [
        "//:package.json",
        "//:tsconfig.json",
        "//:.eslintrc",
        "//:.eslintignore",
    ],
    output_dir = True,
    tool = "@npm//eslint/bin:eslint",
)

nodejs_test(
    name = "test",
    entry_point = "@npm//:node_modules/mocha/bin/mocha",
    data = glob(["**/*.ts"]) + deps + type_deps + dev_deps + [
        "//:package.json",
        "//:tsconfig.json"
    ],
    templated_args = [
        "--require mocha",
        "--require ts-node/register",
        "TS_NODE_PROJECT=tsconfig.json",
        "mocha --config tests/.mocharc.json -r",
        "ts-node/register \"./**/*.spec.ts\""
    ],
)
