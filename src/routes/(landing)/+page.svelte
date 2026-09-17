<script lang="ts">
	import LandingSplashArt from '$lib/assets/landing.webp';
    import LoginModal from './LoginModal.svelte';
</script>

<section>
    <header>
        <h1>Your ideas, thoughts, and plans organized in <span>Nestly</span>.</h1>
        <h2>Manage assorted notes in a neatly structured project. Exportable, modular, and flexible.</h2>
        <nav>
            <a href="/#login" class="primary">Get Started</a>
            <a href="/about" class="secondary">Learn More</a>
        </nav>
    </header>
    <figure>
        <img src={LandingSplashArt} alt="Nestly Landing Page" />
    </figure>
    <LoginModal />
</section>

<style lang="postcss">
    section {
        display: flex;
        gap: 2rem;
        height: 25rem;
        width: 75rem;
        align-items: center;
        margin: 4rem 0;
    }

    header {
        display: flex;
        flex-direction: column;
        gap: 1.3rem;

        h1 {
            font-size: 3.6rem;
            font-weight: 600;
            line-height: 4rem;
            color: var(--color-text-1);
        }

        h2 {
            font-size: 1.9rem;
            font-weight: 400;
            line-height: 2.2rem;
            color: var(--color-text-2);
        }

        span {
            color: var(--color-accent-lit);
            font-weight: 600;
        }

        nav {
            display: flex;
            gap: 1rem;
        }
        a {
            font-size: 1.6rem;
            font-weight: 400;
            padding: 0.4rem 1.7rem;
            border-radius: 10px;
            transition: background-color 0.3s ease;
        }
    }
    
    .primary {
        background-color: var(--color-accent);
        color: var(--color-text-0);

        &:hover {
            background-color: var(--color-accent-dim);
        }
    }

    .secondary {
        background-color: var(--color-bg-3);
        color: var(--color-accent-bright);

        &:hover {
            background-color: var(--color-bg-2);
        }
    }

    figure {
        flex-shrink: 0;
    }

    img {
        height: 26rem;
        object-fit: contain;
    }

    @media (prefers-color-scheme: dark) {
        img {
            filter: invert(80%);
        }
}
</style>