import { Component, OnInit } from '@angular/core';
import { Result } from './result';
import { WebWorkerService } from 'ngx-web-worker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [WebWorkerService]
})
export class AppComponent implements OnInit {
    public webWorkerResults: any[] = [];
    public webWorkerStart = 35;
    public webWorkerEnd = 45;
    public synchronousStart = 35;
    public synchronousEnd = 38;
    public synchronousResults: any[] = [];
    public synchronousDuration = 0;
    private promises: Promise<any>[] = [];

    constructor(private _webWorkerService: WebWorkerService) {}

    startWebWorkerCalculation() {
        let pointer = this.webWorkerStart;
        const end = this.webWorkerEnd;

        this.stopWebWorkerCalculation();
        while (pointer <= end) {
            this.webWorkerCalculate(pointer);
            pointer++;
        }
    }

    stopWebWorkerCalculation() {
        this.promises.forEach(promise => {
            this._webWorkerService.terminate(promise);
        });
        this.promises.length = 0;
        this.webWorkerResults.length = 0;
    }

    startSynchronousCalculation() {
        let pointer = this.synchronousStart;
        const end = this.synchronousEnd;

        this.synchronousResults.length = 0;

        const start = new Date();
        while (pointer <= end) {
            const result = new Result(pointer, this.fib(pointer), false);
            this.synchronousResults.push(result);
            pointer++;
        }
        this.synchronousDuration = (new Date().getTime() - start.getTime()) / 1000;
    }

    ngOnInit() {}

    private webWorkerCalculate(n: number) {
        const promise = this._webWorkerService.run(this.fib, n);
        const result = new Result(n, 0, true);
        this.webWorkerResults.push(result);
        this.promises.push(promise);

        promise.then(function(response) {
            result.result = response;
            result.loading = false;
        });
    }

    private fib(n: number) {
        const fib = (n: number): number => {
            if (n < 2) return 1;
            return fib(n - 1) + fib(n - 2);
        };

        return fib(n);
    }
}
