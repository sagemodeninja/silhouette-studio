import { AnchoredRegion, MenuItem, designUnit, fluentAnchoredRegion, fluentButton, fluentMenu, fluentMenuItem, provideFluentDesignSystem } from '@fluentui/web-components';
import { Button } from '@microsoft/fast-foundation';

provideFluentDesignSystem()
    .register(
        fluentButton(),
        fluentAnchoredRegion(),
        fluentMenu(),
        fluentMenuItem(),
    );

export class MenuBar {
    private _menus: NodeListOf<AnchoredRegion>;
    private _menuButtons: NodeListOf<Button>;
    private _menuItems: NodeListOf<MenuItem>;
    private _callback: (action: string) => void;
    private _activeMenu?: AnchoredRegion;

    constructor() {
        this._menus = document.querySelectorAll('.menu-region');
        this._menuButtons = document.querySelectorAll('.menu-button');
        this._menuItems = document.querySelectorAll('.menu fluent-menu-item');

        this._menus.forEach(m => m.remove());
        this._menuButtons.forEach(b => designUnit.setValueFor(b, 2.5));

        this.addEventListeners();
    }

    public oninvoke(callback: (action: string) => void) {
        this._callback = callback;
    }

    private addEventListeners() {
        document.addEventListener('click', () => this._activeMenu?.remove());

        const menus = Array.from(this._menus);
        this._menuButtons.forEach(b => {
            b.addEventListener('click', e => {
                const menu = menus.find(m => m.anchor == b.id);

                if (menu.isConnected)
                {
                    menu.remove();
                    return;
                }

                e.stopPropagation();
                this._activeMenu = menu;
                document.body.append(menu);
            });
        });

        this._menuItems.forEach(i => {
            i.addEventListener('click', () => this._callback(i.dataset.action));
        });
    }
}