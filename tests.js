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

    test('default base path', () => {
        const translator = new Translator({ lang: 'uk' });

        tester.equal('/i18n/uk.json', translator.getLangFilePath());
    });

    test('set base path', () => {
        const translator = new Translator({ 
            lang: 'uk', basePath: './i18n' 
        });

        tester.equal('./i18n/uk.json', translator.getLangFilePath());
    });

    test('simple translate', () => {
        const translator = new Translator({ lang: 'uk' });

        translator.setDictionary({
            'hello': 'вітаю'
        });

        tester.equal('вітаю', translator.getTranslation('hello'));
    });

    test('translate with special chars', () => {
        const translator = new Translator({ lang: 'uk' });

        translator.setDictionary({
            'hello': 'вітаю',
            'hello$name': 'вітаю, {name}',
        });

        tester.equal('вітаю', translator.getTranslation('hello'));
        tester.equal('вітаю, {name}', translator.getTranslation('hello$name'));

    });
    
});
