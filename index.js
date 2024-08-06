#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {Graph} = require('graphlib');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

// CLI argument parsing
const argv = yargs(hideBin(process.argv))
    .option('basePath', {
        alias: 'b',
        type: 'string',
        description: 'Base path of the project',
        defaultDescription: 'The first argument or the CWD',
    })
    .option('packageDirs', {
        alias: 'd',
        type: 'string',
        description: 'Comma-separated list of directories to analyze',
        default: 'apps,packages,libs',
    })
    .help()
    .argv;

// Determine basePath
// Use basePath from yargs if provided, otherwise use the first positional argument
const remainingArgs = argv._;
const basePath = argv.basePath
    ? path.resolve(argv.basePath)
    : remainingArgs.length > 0
        ? path.resolve(remainingArgs[0])
        : process.cwd();

const packageDirs = argv.packageDirs.split(',');

// load package.json file on basePath
const monorepoPackageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json')));

// Recursively get all packages in a directory tree
const getPackages = (dir) => {
    const fullPath = path.join(basePath, dir);
    const packages = [];

    const exploreDirectory = (currentPath, baseDir) => {
        if (!fs.existsSync(currentPath)) return; // Check if the path exists

        const files = fs.readdirSync(currentPath);

        files.forEach((file) => {
            const subPath = path.join(currentPath, file);
            const packageJsonPath = path.join(subPath, 'package.json');

            if (fs.existsSync(packageJsonPath)) {
                // If a package.json exists, parse it to get the package details
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
                packages.push({
                    name: packageJson.name,
                    path: baseDir,
                    dependencies: packageJson.dependencies || {},
                    devDependencies: packageJson.devDependencies || {},
                });
            } else if (fs.lstatSync(subPath).isDirectory()) {
                // Recursively explore subdirectories
                exploreDirectory(subPath, baseDir);
            }
        });
    };

    exploreDirectory(fullPath, dir);

    return packages;
};

// Collect package information from all specified directories
const packages = packageDirs.flatMap(getPackages);

// Create a graph using graphlib
const graph = new Graph();

// Add nodes and edges to the graph
packages.forEach((pkg) => {
    graph.setNode(pkg.name); // Add package as a node

    // Process dependencies
    Object.keys(pkg.dependencies).forEach((dep) => {
        if (packages.find((p) => p.name === dep)) { // Only add internal dependencies
            graph.setEdge(pkg.name, dep);
        }
    });

    // Process devDependencies
    Object.keys(pkg.devDependencies).forEach((devDep) => {
        if (packages.find((p) => p.name === devDep)) { // Only add internal devDependencies
            graph.setEdge(pkg.name, devDep);
        }
    });
});

// Function to print the graph with root nodes on the left
const printGraph = (graph) => {
    // Find root nodes (nodes with no incoming edges)
    const nodes = graph.nodes();
    const incomingEdgeCount = new Map(nodes.map(node => [node, 0]));

    nodes.forEach(node => {
        const edges = graph.outEdges(node);
        edges.forEach(edge => {
            incomingEdgeCount.set(edge.w, incomingEdgeCount.get(edge.w) + 1);
        });
    });

    // Filter root nodes
    let rootNodes = nodes.filter(node => incomingEdgeCount.get(node) === 0);

    // Sort root nodes based on the order of packageDirs
    rootNodes = rootNodes.sort((a, b) => {
        const pathA = packages.find(pkg => pkg.name === a).path;
        const pathB = packages.find(pkg => pkg.name === b).path;
        return packageDirs.indexOf(pathA) - packageDirs.indexOf(pathB);
    });

    // Print each root node and its dependencies
    rootNodes.forEach(root => {
        console.log(`\n${root}`);
        printDependencies(graph, root, 1, incomingEdgeCount);
    });
};

// Recursive function to print dependencies
const printDependencies = (graph, node, level, incomingEdgeCount) => {
    const indent = '  '.repeat(level);
    const edges = graph.outEdges(node);

    edges.forEach(edge => {
        const depType = isDevDependency(node, edge.w) ? '[D]' : '';
        const references = incomingEdgeCount.get(edge.w);
        console.log(`${indent}${edge.w} ${depType}(${references})`);
        printDependencies(graph, edge.w, level + 1, incomingEdgeCount);
    });
};

// Function to determine if a dependency is a devDependency
const isDevDependency = (node, dep) => {
    const pkg = packages.find(pkg => pkg.name === node);
    return pkg && pkg.devDependencies.hasOwnProperty(dep);
};

// Print guide information
console.log(`Dependency Graph of [${monorepoPackageJson?.name}]`);
console.log("  - (0) indicate how many times a package is referenced.");
console.log("  - [D] indicates that a package is listed as a devDependency.");
console.log("============================================");

// Output the graph
printGraph(graph);
