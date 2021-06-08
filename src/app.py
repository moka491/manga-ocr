from cefpython3 import cefpython as cef
import base64
import sys
import tempfile

from src.interface import hello_world


def main():
    setup_cef()


def setup_cef():
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error

    settings = {'cache_path': tempfile.gettempdir()}
    cef.Initialize(settings=settings)

    browser = cef.CreateBrowserSync(url="http://localhost:1234",
                                    window_title="Manga OCR")

    setup_bindings(browser)

    cef.MessageLoop()
    cef.Shutdown()


def setup_bindings(browser):
    bindings = cef.JavascriptBindings(
        bindToFrames=False, bindToPopups=False)

    bindings.SetFunction("hello_world", binding_wrapper(hello_world))
    browser.SetJavascriptBindings(bindings)


def binding_wrapper(fn):
    def wrap(cb):
        ret = fn()
        if ret and cb:
            cb.Call(ret)
    return wrap


if __name__ == '__main__':
    main()
