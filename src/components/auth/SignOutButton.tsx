const SighOutButton = () => {
    return (
        <form action="/api/auth/signout" method="POST">
            <button
                type="submit"
                className="font-medium tracking-wide text-slate-400"
            >
                登出
            </button>
        </form>
    );
};

export default SighOutButton;
