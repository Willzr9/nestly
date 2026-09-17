<script lang="ts">
    import 'iconify-icon';

    let { session } = $props();
</script>

<header>
    <h1>Logo</h1>
    <nav>
        <ul>
            {#if session}
                <li>             
                    <form method="POST" action="?/logout">
                        <button type="submit" aria-label="Sign out">
                            Log out
                            <iconify-icon icon="mdi:logout"></iconify-icon>
                        </button>
                    </form>
                </li>
                <li>
                    <a href="/app">Enter Nestly</a>
                </li>
            {:else}
                <li>
                    <a href="/#login">Login</a>
                </li>
            {/if}
        </ul>
    </nav>
</header>

<style lang="postcss">
    header {
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 3rem;
    }

    h1 {
        font-size: 2rem;
    }

    nav {
        font-size: 1.4rem;   
        font-weight: 500;     
    }

    nav ul {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    button, a {
        padding: 0.4rem 1.4rem;
        display: flex;
        gap: 0.6rem;
        align-items: center;
        transition: background-color 0.2s ease;
        border-radius: 10px;
        font-size: 1.2rem;

        &:hover {
            background-color: var(--color-bg-2);
            color: var(--color-text-0);
        }
    }

    a {
        background-color: var(--color-accent);
        color: var(--color-text-0);

        &:hover {
            background-color: var(--color-accent-dim);
        }
    }
</style>