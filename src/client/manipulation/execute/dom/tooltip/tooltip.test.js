/**
 * Proudly created by ohad on 04/01/2017.
 */
const expect           = require('chai').expect,
      _                = require('../../../../common/util/wrapper'),
      BaseError        = require('../../../../common/log/base.error'),
      TooltipExecutor  = require('./tooltip'),
      TooltipInterface = require('./interface'),
      Master           = require('../../master'),
      styles           = require('./tooltip.scss').locals;

describe('TooltipExecutor', function () {
    this.timeout(1000);
    let div, target;
    before(() => {
        div              = document.createElement('div');
        div.style.margin = '150px';
        document.querySelector('body').appendChild(div);
    });
    beforeEach(() => {
        target = document.createElement('a');
        target.setAttribute('id', 'huwayej');
        target.textContent = 'NevoN';
        div.appendChild(target);
    });
    afterEach(() => {
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('preconditions', () => {
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated'})
        }).to.not.throw(Error);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'sharp', direction: 'left'})
        }).to.not.throw(Error);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', htmlContent: ''})
        }).to.not.throw(Error);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', timer: {}})
        }).to.throw(BaseError);
        expect(() => {TooltipExecutor.preconditions({target: '#huwayej',})}).to.throw(BaseError);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', id: {}})
        }).to.throw(BaseError);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', htmlContent: {}})
        }).to.throw(BaseError);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'shubi-dubi'})
        }).to.throw(BaseError);
        expect(() => {
            TooltipExecutor.preconditions({target: '#huwayej', type: 'sharp', effectNum: 1})
        }).to.throw(BaseError);
    });
    it('creation', () => {
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej'});
        const tooltip = document.querySelector(`div>.${styles.bloated}`);
        expect(tooltip).to.be.ok;
        expect(tooltip.classList.contains(styles.bloated)).to.be.true;
        expect(tooltip.classList.contains(styles.show)).to.be.false;
        expect(tooltip.querySelector(target.nodeName)).to.be.ok;
    });
    it('interface', (done) => {
        TooltipInterface.execute({target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej'});
        setTimeout(() => {
            const tooltip = document.querySelector(`div>.${styles.bloated}`);
            expect(tooltip).to.be.ok;
            expect(tooltip.classList.contains(styles.bloated)).to.be.true;
            expect(tooltip.classList.contains(styles.show)).to.be.false;
            expect(tooltip.querySelector(target.nodeName)).to.be.ok;
            done();
        });
    });
    it('creation with special property', () => {
        TooltipExecutor.execute({target: '#huwayej', type: 'sharp', direction: 'left'});
        const tooltip = document.querySelector(`div>.${styles.sharp}`);
        expect(tooltip).to.be.ok;
        expect(tooltip.classList.contains(styles.left)).to.be.true;
        expect(tooltip.querySelector(target.nodeName)).to.be.ok;
    });
    it('flow', (done) => {
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej'});
        const tooltip = document.querySelector(`div>.${styles.bloated}`);
        _.trigger(Master.eventName(TooltipInterface.name), {state: TooltipExecutor.State.SHOW});
        setTimeout(() => {
            expect(tooltip.classList.contains(styles.show)).to.be.true;
            _.trigger(Master.eventName(TooltipInterface.name), {state: TooltipExecutor.State.HIDE});
            setTimeout(() => {
                expect(tooltip.classList.contains(styles.show)).to.be.false;
                done();
            }, 10);
        }, 10);
    });
    it('flow with timer', (done) => {
        TooltipExecutor.execute(
            {target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej', timer: 20});
        const tooltip = document.querySelector(`div>.${styles.bloated}`);
        _.trigger(Master.eventName(TooltipInterface.name), {state: TooltipExecutor.State.SHOW});
        setTimeout(() => {
            expect(tooltip.classList.contains(styles.show)).to.be.true;
            setTimeout(() => {
                expect(tooltip.classList.contains(styles.show)).to.be.false;
                done();
            }, 20);
        }, 10);
    });
    it('flow without state', (done) => {
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej'});
        const tooltip = document.querySelector(`div>.${styles.bloated}`);
        _.trigger(Master.eventName(TooltipInterface.name));
        setTimeout(() => {
            expect(tooltip.classList.contains(styles.show)).to.be.true;
            _.trigger(Master.eventName(TooltipInterface.name));
            setTimeout(() => {
                expect(tooltip.classList.contains(styles.show)).to.be.false;
                done();
            }, 10);
        }, 10);
    });
    it('multiple tooltips', (done) => {
        const target2 = target.cloneNode(true);
        target2.setAttribute('id', 'huwayej2');
        target2.style.margin = '100px';
        div.appendChild(target2);
        TooltipExecutor.execute({target: '#huwayej', id: 1, type: 'bloated', htmlContent: 'hum'});
        TooltipExecutor.execute(
            {target: '#huwayej2', id: 2, type: 'bloated', htmlContent: 'dodim'});
        const tooltip1 = document.querySelector(`#${TooltipExecutor.tooltipId(1)}`),
              tooltip2 = document.querySelector(`#${TooltipExecutor.tooltipId(2)}`);
        _.trigger(Master.eventName(TooltipInterface.name),
                  {id: 1, state: TooltipExecutor.State.SHOW});
        setTimeout(() => {
            expect(tooltip1.classList.contains(styles.show)).to.be.true;
            expect(tooltip2.classList.contains(styles.show)).to.be.false;
            _.trigger(Master.eventName(TooltipInterface.name),
                      {id: 2, state: TooltipExecutor.State.SHOW});
            setTimeout(() => {
                expect(tooltip1.classList.contains(styles.show)).to.be.true;
                expect(tooltip2.classList.contains(styles.show)).to.be.true;
                _.trigger(Master.eventName(TooltipInterface.name),
                          {id: 1, state: TooltipExecutor.State.HIDE});
                setTimeout(() => {
                    expect(tooltip1.classList.contains(styles.show)).to.be.false;
                    expect(tooltip2.classList.contains(styles.show)).to.be.true;
                    _.trigger(Master.eventName(TooltipInterface.name),
                              {id: 2, state: TooltipExecutor.State.HIDE});
                    setTimeout(() => {
                        expect(tooltip1.classList.contains(styles.show)).to.be.false;
                        expect(tooltip2.classList.contains(styles.show)).to.be.false;
                        done();
                    }, 10);
                }, 10);
            }, 10);
        }, 10);
    });
    it('detaching tooltip', () => {
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej'});
        let tooltip = document.querySelector(`div>.${styles.bloated}`);
        expect(tooltip).to.be.ok;
        TooltipExecutor.detachTooltip(target);
        tooltip = document.querySelector(`div>.${styles.bloated}`);
        expect(tooltip).to.not.be.ok;
    });
    it('overriding tooltip', () => {
        const msg1 = 'hum', msg2 = 'dodim';
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: msg1});
        let tooltip = document.querySelector(`div>.${styles.bloated}`);
        expect(tooltip.querySelector(`[${TooltipExecutor.contentAttribute}]`).textContent).to.equal(
            msg1);
        TooltipExecutor.execute({target: '#huwayej', type: 'bloated', htmlContent: msg2});
        tooltip = document.querySelector(`div>.${styles.bloated}`);
        expect(tooltip.querySelector(`[${TooltipExecutor.contentAttribute}]`).textContent).to.equal(
            msg2);
        expect(document.querySelectorAll(`div>.${styles.bloated}`).length).to.equal(1);
    });
});