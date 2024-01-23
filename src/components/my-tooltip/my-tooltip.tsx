import { Component, Element, Prop, h } from "@stencil/core";

@Component({
    tag: 'uc-tooltip',
    styleUrl: 'my-tooltip.css',
    shadow: true,
})

export class Tooltip {

    @Prop({reflect: true}) tooltipText: string;

    @Element() el;

    openTooltip() {
        const tooltip = this.el.shadowRoot.querySelector('.tooltip-text')
        const isVisible = tooltip.style.display
        tooltip.style.display = isVisible === 'none' ? 'block' : 'none'
    }
    
    render() {

        return [
            <div class="title">
                <slot name="title">Show Tooltip</slot>
            </div>,
            <div class="tooltip-container">
                <span onClick={this.openTooltip.bind(this)}>?</span>

                <p class="tooltip-text">{this.tooltipText}</p>
            </div>
        ]
    }
}