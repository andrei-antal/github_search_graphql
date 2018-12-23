export interface User {
  name: string;
  user: string;
  url: string;
  avatarUrl: string;
  email: string;
  location: string;
  bio: string;
  lastPr: string;
  createdAt: Date;
  starred: number;
  followers: number;
  repositories: number;
  watching: number;
}

export interface UserApi {
  cursor: string;
  node: {
    name: string;
    avatarUrl: string;
    email: string;
    createdAt: string;
    location: string;
    bio: string;
    url: string;
    pullRequests: {
      nodes: {url: string}[]
    }
    starredRepositories: {
      totalCount: number;
    },
    followers: {
      totalCount: number;
    },
    repositories: {
      totalCount: number;
    },
    watching: {
      totalCount: number
    }
  };
}

export function parseUsers(responseApi: UserApi[]): User[] {
  return responseApi.map(({node}: UserApi) => ({
    name: node.name,
    user: node.url.split('https://github.com/')[1],
    url: node.url,
    avatarUrl: node.avatarUrl,
    location: node.location,
    bio: node.bio,
    lastPr: node.pullRequests.nodes[0] ? node.pullRequests.nodes[0].url : null,
    email: node.email,
    createdAt: new Date(node.createdAt),
    starred: node.starredRepositories.totalCount,
    followers: node.followers.totalCount,
    repositories: node.repositories.totalCount,
    watching: node.watching.totalCount,
  }));
}

