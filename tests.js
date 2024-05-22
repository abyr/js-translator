import { fileURLToPath } from 'url';
import { group, test } from './js-test-tools/test-runner.js';
import tester from './js-test-tools/tester.js';
import Translator from './translator.js';

const filePath = fileURLToPath(import.meta.url);

group(filePath, () => {
    test('default lang code', async () => {
        const translator = new Translator({ lang: 'uk' });

        tester.equal('uk', translator.getLangCode());
    });

    test('local lang code from string', async () => {
        const originGetNav = Translator.prototype.getNavigator;

        Translator.prototype.getNavigator = () => {
            return {
                language: 'uk',
            };
        }

        const translator = new Translator();

        Translator.prototype.getNavigator = originGetNav;

        tester.equal('uk', translator.getLangCode());
    });

    test('local lang code from array', async () => {
        const originGetNav = Translator.prototype.getNavigator;

        Translator.prototype.getNavigator = () => {
            return {
                languages: ['uk-UA', 'en-GB'],
            };
        }

        const translator = new Translator();

        Translator.prototype.getNavigator = originGetNav;

        tester.equal('uk', translator.getLangCode());
    });

    test('translate', () => {
        const translator = new Translator({ lang: 'uk' });

        translator.setDictionary({
            'hello': 'вітаю'
        });

        tester.equal('вітаю', translator.getTranslation('hello'));
    });
    
});
