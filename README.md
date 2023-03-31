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

[Demo Link](https://gim-yu-2001.vercel.app)
</div>

## 目錄

- [如何啟動專案](#%E5%A6%82%E4%BD%95%E5%95%9F%E5%8B%95%E5%B0%88%E6%A1%88)
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



## 使用的技術

![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
