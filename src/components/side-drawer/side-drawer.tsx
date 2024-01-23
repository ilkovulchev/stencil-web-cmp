import { Component, Method, Prop, State, h } from '@stencil/core';

@Component({
    tag: 'uc-side-drawer',
    styleUrl: 'side-drawer.css',
    shadow: true,
})

export class SideDrawer {
    /** 
     * reflect: says to reflect changes of the prop to the attribute
     * 
     * mutable: when set to true it enables to option to mutate/change a prop within the class
    */
    @Prop({reflect: true}) headTitle: string;
    @Prop({reflect: true, mutable: true}) opened: boolean;

    /**
     * Does not watch changes from outside, only from the inside
     */
    @State() showContactInfo = false;

    onCloseDrawer() {
        this.opened = false
    }

    onContentChange(content: string) {
        this.showContactInfo = content === 'contact';
    }

    /**
     * Make methods available outside of the class (public)
     */
    @Method()
    async open() {
        this.opened = true;
    }

    render() {
        let mainContent = <slot/>;
        if (this.showContactInfo) {
            
            mainContent = (
                <div>
                    <h2>Contant Info</h2>
                    <p>Reach use</p>
                    <ul>
                        <li>Phone</li>
                        <li>Email</li>
                    </ul>
                </div>
            )
        }
        // let content = null;
        // if (this.opened) {
        //     content = (
        //         <aside>
        //             <header><h1>{this.headTitle}</h1></header>
        //             <main>
        //                 <slot/>
        //             </main>        
        //         </aside>
        //     );
        // }
        return[
            <div class="backdrop" onClick={this.onCloseDrawer.bind(this)}></div>,
            <aside>
                <header>
                    <h1>{this.headTitle}</h1>
                    <button onClick={this.onCloseDrawer.bind(this)}>X</button>
                </header>
                <section id="tabs">
                    <button class={ !this.showContactInfo ? 'active' : null } onClick={this.onContentChange.bind(this, 'nav')}>Navigation</button>
                    <button class={ this.showContactInfo ? 'active' : null } onClick={this.onContentChange.bind(this, 'contact')}>Content</button>
                </section>
                <main>
                    {mainContent}
                </main>        
            </aside>
        ];
    }
}