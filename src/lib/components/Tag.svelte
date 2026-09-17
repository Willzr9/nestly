<script lang="ts">
    let { id, name, color } = $props();

</script>

<div style="background-color: {color};">
    <span>{name}</span>
    <button><iconify-icon icon="dashicons:remove"></iconify-icon></button>
</div>

<style>
    div {
        display: flex;
        align-items: center;
        gap: 8px;

        color: var(--color-text-0);
        font-size: 0.875rem;
        background-color: var(--color-bg-1);
        border-radius: 0.5rem;
        padding: 0.2rem;
        border: 1px solid rgba(255, 255, 255, 0.1);

        z-index: 10;
    }

    button {
        background-color: transparent;
        border: none;
        font-size: 1rem;
        display: flex;
        align-items: center;

        color: var(--color-text-0)
    }
</style>