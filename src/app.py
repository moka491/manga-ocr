from cefpython3 import cefpython as cef
import sys
import tempfile

from src.interface import get_name


def main():
    init_cef()


def init_cef():
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error

    settings = {'cache_path': tempfile.gettempdir()}
    cef.Initialize(settings=settings)

    url = "http://localhost:1234" if "--dev" in sys.argv else "file:///web/dist/index.html"

    browser = cef.CreateBrowserSync(url=url, window_title="Manga OCR")

    setup_bindings(browser)

    cef.MessageLoop()
    cef.Shutdown()


def setup_bindings(browser):
    bindings = cef.JavascriptBindings(
        bindToFrames=False, bindToPopups=False)

    bindings.SetFunction("get_name", binding_wrapper(get_name))
    browser.SetJavascriptBindings(bindings)


def binding_wrapper(fn):
    def wrap(cb):
        ret = fn()
        if ret and cb:
            cb.Call(ret)
    return wrap


if __name__ == '__main__':
    main()
