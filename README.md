<p align="center">
  <a href="https://gim-yu-2001.vercel.app">
    <img width="200" src="https://user-images.githubusercontent.com/49834964/228999162-77c770f0-88c6-47ed-8b3e-ee0733cf83c4.png">
  </a>
</p>

<h1 align="center">Gim</h1>

<div align="center">

一個基於 GitHub API 的任務管理網頁應用程式

![vercel][vercel-image] [![CodeQL][codeql-image]][codeql-workflow-url] [![Renovate status][renovate-image]][renovate-dashboard-url]

[vercel-image]: https://vercelbadge.vercel.app/api/justYu2001/gim?style=plastic
[codeql-image]: https://github.com/justYu2001/gim/workflows/CodeQL/badge.svg
[codeql-workflow-url]: https://github.com/justYu2001/gim/actions?query=workflow%3ACodeQL
[renovate-image]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=plastic
[renovate-dashboard-url]: https://github.com/justYu2001/gim/issues/4

</div>

## 目錄

- [如何啟動專案](#%E5%A6%82%E4%BD%95%E5%95%9F%E5%8B%95%E5%B0%88%E6%A1%88)
- [專案架構設計說明](#%E5%B0%88%E6%A1%88%E6%9E%B6%E6%A7%8B%E8%A8%AD%E8%A8%88%E8%AA%AA%E6%98%8E)
- [使用的技術](#%E4%BD%BF%E7%94%A8%E7%9A%84%E6%8A%80%E8%A1%93)

## 如何啟動專案

1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) 本專案

```bash
git clone https://github.com/justYu2001/gim.git
```

2. 進入專案資料夾

```bash
cd gim
```

3. 使用 [pnpm](https://pnpm.io/) 安裝套件

```bash
pnpm i
```

4.在專案目錄底下新增一個 `.env` 檔，並將以下內容複製到檔案裡

> `ADMIN_ACCESS_TOKEN` 的內容請到[此連結](https://hackmd.io/@Yu2001/BJyhrl4bn)複製

```
# GitHub OAuth
CLIENT_ID="6ae6ef7260480074bfba"
CLIENT_SECRET="1c5b1be6c92715ac98f3029547d914cbb725fd5b"

# iron-session
SECRET_COOKIE_PASSWORD="CP67JKQZfvTv6WvemYxmDXXP3P8nL0qz"

# Admin Token
ADMIN_ACCESS_TOKEN=""
```

5. 啟動專案


```bash
pnpm dev
```

6. 在瀏覽器網址列輸入以下即可進入網站

> :warning: 如果從 `http://localhost:3000` 進入網站的話會無法正常登入
```
http://127.0.0.1:3000
```

## 專案架構設計說明

### `src` 資料夾結構

```
.
├─ env.mjs
├─ middleware.ts
├─ components
│  ├─ auth
│  │  ├─ SignInButton.tsx
│  │  └─ SignOutButton.tsx
│  ├─ common
│  │  ├─ Form.tsx
│  │  ├─ Portal.tsx
│  │  ├─ Modal.tsx
│  │  ├─ TabList.tsx
│  │  └─ Title.tsx
│  ├─ layout
│  │  ├─ Header.tsx
│  │  └─ Layout.tsx
│  ├─ task
│  │  ├─ DeleteTaskDialog.tsx
│  │  ├─ EditTaskModal.tsx
│  │  ├─ TaskFormDropdown.tsx
│  │  ├─ TaskFormInput.tsx
│  │  └─ TaskFormTextArea.tsx
│  └─ user
│     └─ UserAvatar.tsx
├─ hooks
│  ├─ modal.ts
│  ├─ task.ts
│  └─ user.ts
├─ pages
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ callback.ts
│  │  │  ├─ signin.ts
│  │  │  └─ signout.ts
│  │  ├─ task
│  │  │  ├─ [id].ts
│  │  │  └─ index.ts
│  │  └─ user.ts
│  ├─ task
│  │  ├─ [id].ts
│  │  ├─ new.ts
│  │  └─ index.ts
│  ├─ _app.tsx
│  ├─ error.tsx
│  └─ index.tsx
├─ types
│  └─ iron-session.d.ts
├─ utils
│  ├─ api-handler.ts
│  ├─ github-api.ts
│  ├─ session.ts
│  ├─ task.ts
│  └─ zod.ts
└─ styles
   └─ globals.css

```

### `env.mjs`

使用 [zod](https://zod.dev/) 定義及驗證環境變數的型別

### `middleware.ts`

使用 Next.js 的 [middleware](https://nextjs.org/docs/advanced-features/middleware) 功能實作路由保護功能。當未登入的使用者嘗試訪問任務列表頁時會被跳轉到登入頁面。當已登入使用者訪問登入頁面時會被跳轉到任務列表頁。

### `components/auth`

存放與登入登出相關元件程式碼的資料夾

#### `components/auth/SignInButton.tsx`

登入按鈕元件。當使用者按下後會 disable，並且 POST `/api/auth/signin` 進行登入。

#### `components/auth/SignOutButton.tsx`

登出按鈕元件。當使用者按下後會 disable，並且 POST `/api/auth/signout` 進行登入。

### `components/common`

存放（可能）會被各種不同的元件或頁面共用的元件程式碼

#### `components/common/Form.tsx`

一個基於 [React Hook Form](https://react-hook-form.com/) 的 [`FormProvider`](https://react-hook-form.com/api/formprovider/) 的表單元件。

#### `components/common/Portal.tsx`

一個封裝 [React.createPortal](https://react.dev/reference/react-dom/createPortal) 的元件

#### `components/common/Modal.tsx`

一個基於 [`Portal`](#componentscommonPortaltsx) 的燈箱（Modal）元件

#### `components/common/TabList.tsx`

用於標籤分頁切換的元件

#### `components/common/Title.tsx`

頁面標題元件

### `components/layout`

存放與 Next.js 的 [Layout](https://nextjs.org/docs/basic-features/layouts) 功能相關的元件

#### `components/layout/Header.tsx`

一個 HTML 標籤 `header` ，包含了 Logo、使用者頭像、登入按鈕和登出按鈕。會根據路徑顯示不同的內容，左邊會固定顯示 Logo，當使用者訪問錯誤頁面（`/error`）時，右邊會是空的；當使用者訪問登入頁面（`/`）時，右邊會是登入按鈕；當使用者訪問任務列表頁面（`/task`）時，右邊會是使用者頭像以及登出按鈕

#### `components/layout/layout.tsx`

所有頁面共享的 UI 佈局，包含了一個 [`Header`](#componentslayoutHeadertsx) 元件和一個 HTML 標籤 `main`

### `components/task`

存放跟任務相關的元件程式碼

#### `components/task/DeleteTaskDialog.tsx`

一個刪除任務的確認對話框元件。為了延遲載入（Lazy Loading）這個元件才會將它的程式碼放到單獨的檔案。

#### `components/task/EditTaskModal.tsx`

一個編輯任務的燈箱（Modal）元件。為了延遲載入（Lazy Loading）這個元件才會將它的程式碼放到單獨的檔案。

#### `components/task/TaskFormDropdown.tsx`

一個用於任務表單的下拉式選單元件。

#### `components/task/TaskFormInput.tsx`

一個用於任務表單的單行文字輸入框元件。

#### `components/task/TaskFormTextArea.tsx`

一個用於任務表單的多行文字輸入框元件。

### `components/user`

存放跟使用相關的元件程式碼

#### `components/user/UserAvatar.tsx`

一個用於顯示使用者頭像的元件。

### `hooks`

存放 Custom hooks 程式碼的資料夾

#### `hooks/modal.ts`

存放跟 [`Modal`](#componentscommonModaltsx) 元件相關的 Custoem hook 程式碼。

這裡面有一個 `useModal` hook，用於控制 [`Modal`](#componentscommonModaltsx) 元件的開關

#### `hooks/task.ts`

存放跟呼叫任務相關的 API 相關的 Custoem hook 程式碼。

裡面有一個 `taskQueryKeys` 變數，定義所有呼叫跟任務相關 API 的 Query 會用到的 [Query Keys](https://tanstack.com/query/v4/docs/react/guides/query-keys)，方便開發者對 Query 進行操作以及避免打錯 Query Key

裡面 5 個有基於 [React Query](https://tanstack.com/query/v4/docs/react/overview) 的 Custom hook，分別是：

- `useTask`: 用於取得單個任務的資料
- `useTasks`: 用於查詢任務
- `useAddTask`: 用於新增任務
- `useUpdateTask`: 用於更新任務內容
- `useDeleteTask`: 用於刪除任務

#### `hooks/user.ts`

存放跟呼叫使用者相關的 API 相關的 Custoem hook 程式碼。

這裡面有一個有基於 [React Query](https://tanstack.com/query/v4/docs/react/overview) 的 `userUser` hook，用於取得使用者資訊

### `pages/api`

存放所有 API 路由的程式碼

#### `pages/api/auth/callback.ts`

負責處理 GitHub OAuth 驗證重定向請求的 API。

使用者在登入 GitHub 後，GitHub 會對這個 API 發一個重定向請求。此時這個 API 路由會從請求的中的查詢參數取得授權代碼，使用此代碼向 GitHub 發送另一個請求，取得使用者的 Access Token。取得 Access Token 後，會再透過 GitHub User API 取得使用者資訊，並將 Access Token 以及使用者名稱存儲在使用者的 session 中，方便需要對 GitHub API 發請求的 API 路由使用。

這個檔案裡有一個叫 `GithubAuthError` 的 class，負責處理在登入的流程中可能會遇到的各種錯誤，當有錯誤發生時，會將錯誤輸出到 log。

#### `pages/api/auth/signin.ts`

負責處理使用者登入請求的 API。

當使用者需要登入時，客戶端會需要對此 API 路由發一個 POST 請求，收到請求後會將使用者跳轉至 GitHub Oauth 的授權頁面


#### `pages/api/auth/signout.ts`

負責處理使用者登出請求的 API。

當使用者需要登出時，客戶端會需要對此 API 路由發一個 POST 請求，收到請求後會將使用者的 session 請除並跳轉至首頁


#### `pages/api/task/[id].ts`

這個 API 有兩個 endpoint，分別負責處理取得單個任務的資料以及刪除任務

- GET `/api/task/:id`
    透過 `id` 取得對應 ID 的任務資料並回傳
- DELETE `/api/task/:id`
    刪除對應 ID 的任務

#### `pages/api/task/index.ts`

這個 API 有 3 個 endpoint，分別負責處理查詢任務、新增任務以及更新任務資訊

- GET `/api/task`
    查詢任務
- POST `/api/task`
    新增任務
- PATCH `/api/task`
    更新任務資訊

#### `pages/api/user.ts`

這個 API 負責取得使用者資料。

前端需要使用者資料時，會需要對此 API 路由發一個 GET 請求，收到請求後會對 [GitHub User API](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user) 發請求，並回傳使用者名稱以及頭像的連結。

### `pages/task`

存放跟任務相關頁面的程式碼

#### `pages/task/[id].tsx`

任務詳情頁

#### `pages/task/index.tsx`

任務列表頁

#### `pages/task/new.tsx`

新增任務頁

#### `pages/_app.tsx`

所有頁面的父元件，如果需要用到某個第三方函式庫的 Provider（如：[React Query](https://tanstack.com/query/v4/docs/react/overview)）可以在這裡加上

#### `pages/error.tsx`

存放錯誤頁面的程式碼。只要發生任何非預期的錯誤，使用者都會被跳轉到這個頁面

#### `pages/index.tsx`

存放首頁（登入頁）的程式碼

### `types`

存放型別宣告檔案的資料夾

#### `types/iron-session.d.ts`

跟 [iron-session](https://github.com/vvo/iron-session) 相關的型別宣告

### `utils`

存放會被專案各處重複使用的函式、變數與型別

#### `utils/api-handler.ts`

存放一些跟 API 路由相關，會被重複使用的函式

裡面有一個叫 `githubApiHandler` 的 Higher Order Function，封裝了會對 GitHub API 發請求的 API 路由所需的程式邏輯以及錯誤處裡，以減少相關重複程式碼的數量。


#### `utils/github-api.ts`

存放一些跟 GitHub API 相關，會被重複使用的函式

裡面有 4 個函式：
- `createGithubApiClient`：建立一個 [axios](https://github.com/axios/axios) 的實體，這個實體有設定每次請求 GitHub API 需要的 header，這樣開發者就不需要每次對 GitHub API 發請求時都需要設定 header
- `getGithubUser`：用於取得 GitHub 的使用者資訊
- `searchGithubIssues`：用於搜尋 GitHub Issue
- `updateGithubIssue`：用於更新 GitHub Issue 的資訊
- `convertGithubIssueToTask`：將 GitHub Issue 的資料格式轉換為任務的資料格式


#### `utils/session.ts`

存放一些跟 session 相關，會被重複使用的函式

裡面有一個叫 `withSessionRoute` 的 Higher Order Function，用於建立需要存取 session 的 API 路由

#### `utils/task.ts`

存放一些跟任務相關，會被重複使用的變數與型別

#### `utils/zod.ts`

存放一些跟 [zod](https://zod.dev/) 相關，會被重複使用的函式

裡面有一個 `formatZodErrors` 函式，用於格式化 [zod](https://zod.dev/) 錯誤訊息

### `styles`

存放全域 CSS 樣式的資料夾


## 使用的技術

![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
