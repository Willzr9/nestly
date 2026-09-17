<script lang="ts">
    import type { Snippet } from 'svelte';
    interface PopoverProps {
        isOpen: boolean;
        triggerElement: HTMLElement | null;
        placement: string;
        offset?: number;
        onClose: () => void;
        children: Snippet;
    }

    let { isOpen = $bindable(), triggerElement, placement, offset = 8, onClose, children }: PopoverProps = $props();

    let popoverElement = $state<HTMLElement>();
    let position = $state({ top: 0, left: 0 });

    function handleClickOutside(event: MouseEvent) {
      if (!popoverElement!.contains(event.target as Node) &&
          !triggerElement!.contains(event.target as Node))
            onClose();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!isOpen) return;
        if (event.key === 'Escape')
            onClose();
    }

    $effect(() => {
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
        };
    });

    $effect(() => {
        if (isOpen && triggerElement && popoverElement) {
            setTimeout(calculatePosition, 0);
            
            // Recalculate on resize/scroll
            const handleResize = () => calculatePosition();
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleResize, true);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleResize, true);
            };
        }
    });

      function calculatePosition() {
    if (!triggerElement || !popoverElement) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    const popoverRect = popoverElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    let top = 0;
    let left = 0;
    
    // Calculate base position based on placement
    switch (placement.split('-')[0]) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'right':  
        left = triggerRect.right + offset;
        break;
    }
    
    // Handle alignment (start, center, end)
    const alignment = placement.split('-')[1] || 'center';
    
    if (['top', 'bottom'].includes(placement.split('-')[0])) {
      switch (alignment) {
        case 'start':
          left = triggerRect.left;
          break;
        case 'center':
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'end':
          left = triggerRect.right - popoverRect.width;
          break;
      }
    } else {
      switch (alignment) {
        case 'start':
          top = triggerRect.top;
          break;
        case 'center':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          break;
        case 'end':
          top = triggerRect.bottom - popoverRect.height;
          break;
      }
    }
    
    // Adjust for viewport boundaries
    if (left < 0) left = 8;
    if (left + popoverRect.width > viewport.width) {
      left = viewport.width - popoverRect.width - 8;
    }
    if (top < 0) top = 8;
    if (top + popoverRect.height > viewport.height) {
      top = viewport.height - popoverRect.height - 8;
    }
    
    position = { 
      top: top + viewport.scrollY, 
      left: left + viewport.scrollX 
    };
  }


</script>

<div bind:this={popoverElement} class:show={isOpen} style="top: {position.top}px; left: {position.left}px;">

        {@render children()}
</div>

<style>
  div {
    position: absolute;
    z-index: 1000;
    background: var(--color-bg-1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 15rem;
    padding: 0.4rem;
    animation: popover-out 0.15s ease-out;
    opacity: 0;
    visibility: hidden;
  }

  div.show {
    opacity: 1;
    visibility: visible;
    animation: popover-in 0.15s ease-out;   
  }
  
  @keyframes popover-in {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes popover-out {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
  }
</style>