export type PackageInfo = {
  namespace: string
  shortname: string
  fullname: string
  tag: string
  filepath: string
  url?: URL
}

export type RegistryPackageMeta = {
  _id: string
  _rev: string
  name: string
  'dist-tags': Record<string, string>
  versions: Record<string, RegistryPackageVersion>
}

export type RegistryPackageVersion = {
  name: string
  version: string
  description: string
  private: boolean
  main: string
  author: string
  license: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
  dist: RegistryPackageDist

  [key: string]: any
}

export type RegistryPackageDist = {
  integrity: string
  shasum: string
  tarball: string
  fileCount: number
  unpackedSize: number
  'npm-signature': string
}

export type ImportMap = {
  imports: Record<string, string>
}

export type ConvertedPackage = {
  compiledData: string
}
