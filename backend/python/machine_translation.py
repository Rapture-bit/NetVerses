import argostranslate.package
import argostranslate.translate

argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()

def translate_text(content, from_code, to_code):
    package_to_install = next(
        filter(
            lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
        ),
        None
    )
    if package_to_install:
        argostranslate.package.install_from_path(package_to_install.download())
    
    translatedText = argostranslate.translate.translate(content, from_code, to_code)
    return translatedText

print(translate_text("Hello!", "en", "ar"))