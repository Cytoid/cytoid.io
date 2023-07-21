/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query FetchNavCard($id: ID!) {\n    profile(id: $id) {\n      id\n      exp {\n        totalExp\n        currentLevelExp\n        nextLevelExp\n        currentLevel\n      }\n      rating\n      header {\n        thumbnail\n      }\n      user {\n        id\n        avatar {\n          original\n        }\n      }\n    }\n  }\n": types.FetchNavCardDocument,
    "\n  query FetchLevel($uid: String!){\n    level(uid: $uid) {\n      id\n      uid\n      title\n      description\n      state\n      censored\n      size\n      tags\n      category\n      creationDate\n      modificationDate\n      owned\n      owner {\n        id\n        uid\n        name\n        avatar { large }\n      }\n      charts {\n        difficulty\n        type\n        name\n        notesCount\n      }\n      metadata {\n        artist {\n          name\n          localized_name\n          url\n        }\n        illustrator {\n          name\n          localized_name\n          url\n        }\n        charter {\n          name\n          localized_name\n          url\n        }\n        storyboarder {\n          name\n          localized_name\n          url\n        }\n      }\n      rating {\n        average\n        total\n        distribution\n        rating\n      }\n      bundle {\n        musicPreview\n        backgroundImage {\n          original\n        }\n      }\n    }\n  }\n": types.FetchLevelDocument,
    "\n  query FetchLevelRanking($levelUid: String!, $type: String!, $start: Int!) {\n    chart(levelUid: $levelUid, chartType: $type) {\n      id\n      numPlayers\n      leaderboard(limit: 10, start: $start) {\n        id\n        date\n        owner {\n          id\n          uid\n          name\n          avatar {\n            small\n          }\n        }\n        score\n        accuracy\n        mods\n        details {\n          perfect\n          great\n          good\n          bad\n          miss\n          maxCombo\n        }\n      }\n    }\n  }\n": types.FetchLevelRankingDocument,
    "\n  query GetPost($uid: String!) {\n    page: getPost(uid: $uid) {\n      id\n      uid\n      title\n      slogan\n      content\n      state\n      creationDate\n      modificationDate\n      startDate\n      endDate\n      cover {\n        original\n      }\n    }\n  }\n": types.GetPostDocument,
    "\n  mutation LinkExternalAccount($token: String!) {\n    result: addExternalAccount(token: $token)\n  }\n": types.LinkExternalAccountDocument,
    "\n  mutation ChangePasswordWithToken($password: String!, $token: String!) {\n    success: changePasswordWithToken(password: $password, token: $token)\n  }\n": types.ChangePasswordWithTokenDocument,
    "\n  mutation SendPasswordResetEmail($email: String!){\n    sendResetPasswordEmail(email: $email)\n  }\n": types.SendPasswordResetEmailDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchNavCard($id: ID!) {\n    profile(id: $id) {\n      id\n      exp {\n        totalExp\n        currentLevelExp\n        nextLevelExp\n        currentLevel\n      }\n      rating\n      header {\n        thumbnail\n      }\n      user {\n        id\n        avatar {\n          original\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchNavCard($id: ID!) {\n    profile(id: $id) {\n      id\n      exp {\n        totalExp\n        currentLevelExp\n        nextLevelExp\n        currentLevel\n      }\n      rating\n      header {\n        thumbnail\n      }\n      user {\n        id\n        avatar {\n          original\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchLevel($uid: String!){\n    level(uid: $uid) {\n      id\n      uid\n      title\n      description\n      state\n      censored\n      size\n      tags\n      category\n      creationDate\n      modificationDate\n      owned\n      owner {\n        id\n        uid\n        name\n        avatar { large }\n      }\n      charts {\n        difficulty\n        type\n        name\n        notesCount\n      }\n      metadata {\n        artist {\n          name\n          localized_name\n          url\n        }\n        illustrator {\n          name\n          localized_name\n          url\n        }\n        charter {\n          name\n          localized_name\n          url\n        }\n        storyboarder {\n          name\n          localized_name\n          url\n        }\n      }\n      rating {\n        average\n        total\n        distribution\n        rating\n      }\n      bundle {\n        musicPreview\n        backgroundImage {\n          original\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchLevel($uid: String!){\n    level(uid: $uid) {\n      id\n      uid\n      title\n      description\n      state\n      censored\n      size\n      tags\n      category\n      creationDate\n      modificationDate\n      owned\n      owner {\n        id\n        uid\n        name\n        avatar { large }\n      }\n      charts {\n        difficulty\n        type\n        name\n        notesCount\n      }\n      metadata {\n        artist {\n          name\n          localized_name\n          url\n        }\n        illustrator {\n          name\n          localized_name\n          url\n        }\n        charter {\n          name\n          localized_name\n          url\n        }\n        storyboarder {\n          name\n          localized_name\n          url\n        }\n      }\n      rating {\n        average\n        total\n        distribution\n        rating\n      }\n      bundle {\n        musicPreview\n        backgroundImage {\n          original\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchLevelRanking($levelUid: String!, $type: String!, $start: Int!) {\n    chart(levelUid: $levelUid, chartType: $type) {\n      id\n      numPlayers\n      leaderboard(limit: 10, start: $start) {\n        id\n        date\n        owner {\n          id\n          uid\n          name\n          avatar {\n            small\n          }\n        }\n        score\n        accuracy\n        mods\n        details {\n          perfect\n          great\n          good\n          bad\n          miss\n          maxCombo\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchLevelRanking($levelUid: String!, $type: String!, $start: Int!) {\n    chart(levelUid: $levelUid, chartType: $type) {\n      id\n      numPlayers\n      leaderboard(limit: 10, start: $start) {\n        id\n        date\n        owner {\n          id\n          uid\n          name\n          avatar {\n            small\n          }\n        }\n        score\n        accuracy\n        mods\n        details {\n          perfect\n          great\n          good\n          bad\n          miss\n          maxCombo\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPost($uid: String!) {\n    page: getPost(uid: $uid) {\n      id\n      uid\n      title\n      slogan\n      content\n      state\n      creationDate\n      modificationDate\n      startDate\n      endDate\n      cover {\n        original\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPost($uid: String!) {\n    page: getPost(uid: $uid) {\n      id\n      uid\n      title\n      slogan\n      content\n      state\n      creationDate\n      modificationDate\n      startDate\n      endDate\n      cover {\n        original\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LinkExternalAccount($token: String!) {\n    result: addExternalAccount(token: $token)\n  }\n"): (typeof documents)["\n  mutation LinkExternalAccount($token: String!) {\n    result: addExternalAccount(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePasswordWithToken($password: String!, $token: String!) {\n    success: changePasswordWithToken(password: $password, token: $token)\n  }\n"): (typeof documents)["\n  mutation ChangePasswordWithToken($password: String!, $token: String!) {\n    success: changePasswordWithToken(password: $password, token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendPasswordResetEmail($email: String!){\n    sendResetPasswordEmail(email: $email)\n  }\n"): (typeof documents)["\n  mutation SendPasswordResetEmail($email: String!){\n    sendResetPasswordEmail(email: $email)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;