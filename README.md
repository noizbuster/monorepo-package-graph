# How To Use

### Overview

The `monorepo-package-graph` tool is a command-line application designed to visualize the dependency graph of packages within a monorepo. It identifies both regular and development dependencies, providing a clear, hierarchical view of how packages are interconnected.

### Installation

The tool can be executed directly using `npx`, which means you don't need to install it globally. You can also use the alias `monopg` for convenience.

### Usage

You can run the tool with various options. Below are the typical usage patterns:

```bash
npx monorepo-package-graph [basePath] [options]
```

Or using the alias:

```bash
npm install -g monorepo-package-graph
npx monopg [basePath] [options]
```

- **`basePath`**: The base directory of your project. This can be specified as the first positional argument or as an option.

### Options

- `--basePath`, `-b`: Specify the base path of the project. If omitted, the first positional argument is used, or the current working directory by default.

- `--packageDirs`, `-d`: Comma-separated list of directories to analyze. Defaults to `apps,packages,libs`.

- `--help`: Display help information about the tool.

### Examples

- **Using positional argument for basePath**:
  ```bash
  npx monorepo-package-graph /path/to/your/project
  ```

- **Using options to specify basePath and package directories**:
  ```bash
  npx monorepo-package-graph --basePath /path/to/your/project --packageDirs packages,shared
  ```

- **Using the alias for convenience**:
  ```bash
  npx monopg /path/to/your/project
  ```

- **Getting help**:
  ```bash
  npx monorepo-package-graph --help
  ```

---

### 개요

`monorepo-package-graph` 도구는 모노레포 내 패키지의 의존성 그래프를 시각화하는 커맨드라인 애플리케이션입니다. 일반 의존성과 개발 의존성을 모두 식별하여 패키지 간의 연결을 명확하고 계층적으로 보여줍니다.

### 설치

이 도구는 `npx`를 사용하여 직접 실행할 수 있으며, 전역 설치가 필요하지 않습니다. 편의를 위해 `monopg`라는 별칭(alias)도 사용할 수 있습니다.

### 사용법

다양한 옵션과 함께 도구를 실행할 수 있습니다. 아래는 일반적인 사용 패턴입니다:

```bash
npx monorepo-package-graph [basePath] [options]
```

또는 별칭을 사용하여:

```bash
npm install -g monorepo-package-graph
npx monopg [basePath] [options]
```

- **`basePath`**: 프로젝트의 기본 디렉토리입니다. 첫 번째 위치 인수 또는 옵션으로 지정할 수 있습니다.

### 옵션

- `--basePath`, `-b`: 프로젝트의 기본 경로를 지정합니다. 생략하면 첫 번째 위치 인수 또는 기본적으로 현재 작업 디렉토리가 사용됩니다.

- `--packageDirs`, `-d`: 분석할 디렉토리의 콤마로 구분된 목록입니다. 기본값은 `apps,packages,libs`입니다.

- `--help`: 도구에 대한 도움말 정보를 표시합니다.

### 예제

- **위치 인수를 사용하여 basePath 지정**:
  ```bash
  npx monorepo-package-graph /path/to/your/project
  ```

- **옵션을 사용하여 basePath 및 패키지 디렉토리 지정**:
  ```bash
  npx monorepo-package-graph --basePath /path/to/your/project --packageDirs apps,packages,shared
  ```

- **별칭을 사용하여 실행**:
  ```bash
  npx monopg /path/to/your/project
  ```

- **도움말 표시**:
  ```bash
  npx monorepo-package-graph --help
  ```

## how to test on cli

```bash
# cd to this directory

# making symbolic link in the global npm directory
npm link

# verify project installed gobally
npm ls -g --depth=0
npm ls -g --depth=0 | grep monorepo-package-graph

# verify CLI works
monorepo-package-graph --help
monopg --help #$ alias

# uninstall
npm unlink monorepo-package-graph
```
