package(default_visibility = ["//visibility:public"])

type_deps = [
    "@npm//@types/jest",
    "@npm//@types/node",
]

dev_deps = [
    "@npm//jest",
    "@npm//ts-jest",
    "@npm//ts-node",
    "@npm//typescript",
]

deps = [
    "@npm//@cdktf/provider-aws",
    "@npm//cdktf",
    "@npm//constructs",
]

genrule(
    name = "build",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*spec.ts",
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ) + [
        ":package.json",
        ":cdktf.json",
        "//:tsconfig.json",
        ":tsconfig.json",
    ] + deps + dev_deps + type_deps,
    outs = [".build-logs"],
    cmd = "bash $(location scripts/build.sh) > \"$@\"",
    local = True,
    tools = ["scripts/build.sh"],
)

# genrule(
#     name = "deploy",
#     srcs = glob(
#         ["**/*.ts"],
#         exclude = [
#             "**/*spec.ts",
#             "__tests__/**/*.*",
#             "node_modules/**/*.*",
#         ],
#     ) + [
#         ":package.json",
#         ":cdktf.json",
#         "//:tsconfig.json",
#         ":tsconfig.json",
#     ] + deps + dev_deps + type_deps,
#     outs = ["show_logs_deploy.sh"],
#     cmd = "bash $(location scripts/deploy.sh) > \"$@\"",
#     executable = True,
#     local = True,
#     tools = ["scripts/deploy.sh"],
# )

# genrule(
#     name = "destroy",
#     srcs = glob(
#         ["**/*.ts"],
#         exclude = [
#             "**/*spec.ts",
#             "__tests__/**/*.*",
#             "node_modules/**/*.*",
#         ],
#     ) + [
#         ":package.json",
#         ":cdktf.json",
#         "//:tsconfig.json",
#         ":tsconfig.json",
#     ] + deps + dev_deps + type_deps,
#     outs = ["show_logs_destroy.sh"],
#     cmd = "bash $(location scripts/destroy.sh) > \"$@\"",
#     executable = True,
#     local = True,
#     tools = ["scripts/destroy.sh"],
# )

sh_binary(
    name = "deploy",
    srcs = ["scripts/deploy.sh"],
    data = glob(
        ["**/*.ts"],
        exclude = [
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ) + [
        ":package.json",
        ":cdktf.json",
        "//:tsconfig.json",
        ":tsconfig.json",
    ] + deps,
)

sh_binary(
    name = "destroy",
    srcs = ["scripts/destroy.sh"],
    data = glob(
        ["**/*.ts"],
        exclude = [
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ) + [
        ":package.json",
        ":cdktf.json",
        "//:tsconfig.json",
        ":tsconfig.json",
    ] + deps,
)

# sh_binary(
#     name = "destroy",
#     srcs = ["scripts/destroy.sh"],
#     data = glob(
#         ["**/*.ts"],
#         exclude = [
#             "__tests__/**/*.*",
#             "node_modules/**/*.*",
#         ],
#     ) + [
#         ":package.json",
#         ":cdktf.json",
#     ] + deps,
# )
