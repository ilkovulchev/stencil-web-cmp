import { Component, Element, Listen, Prop, State, Watch, h } from "@stencil/core";

import { AV_API_KEY } from '../../global/global'

@Component({
    tag: 'uc-stock-price',
    styleUrl: 'stock-price.css',
    shadow: true,
})

export class StockPrice {

    stockInput: HTMLInputElement
    // initialStockSymbol: string;

    @Element() el: HTMLElement;

    /**
     * Does not watch changes from outside, only from the inside
     */
    @State() price: number;
    @State() stockUserInput: string;
    @State() stockInputValid = false;
    @State() error: string;

    @Prop({mutable: true, reflect: true}) stockSymbol: string;

    // sets a watcher for the specified prop
    @Watch('stockSymbol')
    stockSymbolChanged(newV, oldV) {
        if (newV !== oldV) {
            this.stockUserInput = newV;
            this.fetchStockPrice(newV)        
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value

        if (this.stockUserInput.trim() !== '') {
            this.stockInputValid = true
        } else{
            this.stockInputValid = false
        }
    }

    onFetchStockPrice(event: Event) {
        event.preventDefault()

        // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement ).value
        this.stockSymbol = this.stockInput.value
        // this.fetchStockPrice(stockSymbol)     
    }

    componentWillLoad() {
        console.log('first');
        this.stockUserInput = this.stockSymbol;
        this.stockInputValid = true
    }

    componentDidLoad() {
        console.log('second');
        if (this.stockSymbol) {
            // this.initialStockSymbol = this.stockSymbol
            
            this.fetchStockPrice(this.stockSymbol)              
        }
    }

    componentWillUpdate() {
        console.log('third');
    }

    componentDidUpdate() {
        console.log('forth');
        // if (this.stockSymbol !== this.initialStockSymbol) {
        //     this.initialStockSymbol = this.stockSymbol
        //     this.fetchStockPrice(this.stockSymbol)
        // }
    }

    disconnectedCallback() {
        console.log('fifth');
    }

    @Listen('ucSymbolSelected', { target: 'body' })
    onStockSymbolSelected(event: CustomEvent) {
        console.log('stock symbol selected: ' + event.detail);
        
        if (event?.detail !== this.stockSymbol) {
            this.stockSymbol = event.detail   
            this.stockInputValid = true
        }
    }

    fetchStockPrice(stockSymbol: string) {
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
        .then(res => {
            return res.json();
        })
        .then(parsedRes => {
            if (!parsedRes['Global Quote']['05. price']) {
                throw new Error('Invalid Symbol')
            }
            this.error = null;
            this.price = Number(parsedRes['Global Quote']['05. price']);
            console.log(this.price);
        })
        .catch(err => {
            this.error = err.message;
            console.log('this.error', this.error);
            
        })
    }

    hostData() {
        return { class: this.error ? 'error' : '' }
    }

    render() {
        return [
            <form onSubmit={this.onFetchStockPrice.bind(this)}>
                <input
                    id="stock-symbol"
                    ref={el => this.stockInput = el}
                    value={this.stockUserInput}
                    onInput={this.onUserInput.bind(this)}
                />
                <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
            </form>,
            <div>
                <p>Price: {this.error ?? this.price}</p>
            </div>
        ]
    }
}