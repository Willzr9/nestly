<script lang="ts">
    let { hash, children } = $props();
</script>

<div id={hash}>
    <section>
        {@render children?.()}
    </section>  
</div>

<style lang="postcss">
div {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);    

    &:target {
        display: block;
    }
}

section {
    background-color: var(--color-bg-1);
    margin: 15% auto;
    padding: 2rem;
    width: 28rem;
    border-radius: 8px;
    border: 1px solid srgb(0, 0, 0, 0.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
</style>