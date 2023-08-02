import arcade

# Tamaño de la ventana
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 120

# Colores
WHITE = arcade.color.WHITE
GRAY = arcade.color.GRAY

class MyGame(arcade.Window):
    def __init__(self):
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, "Animación Arcade")

        self.text_x = SCREEN_WIDTH // 2
        self.text_y = SCREEN_HEIGHT // 2
        self.text_speed = 2  # Velocidad de movimiento horizontal del texto
        self.colors = [arcade.color.RED, arcade.color.GREEN, arcade.color.BLUE, arcade.color.YELLOW]
        self.color_index = 0

    def on_draw(self):
        arcade.start_render()

        # Dibuja el texto con sombra
        self.draw_text_with_shadow("Jpcode, trasformamos tus ideas en soluciones tecnológicas",
                                   self.text_x, self.text_y, shadow_offset=2)

    def draw_text_with_shadow(self, text, x, y, shadow_offset):
        # Dibuja el texto con sombra
        arcade.draw_text(text, x + shadow_offset, y + shadow_offset, GRAY, font_size=26, width=600, align="center")

        # Dibuja el texto principal encima del texto con sombra con el color actual
        arcade.draw_text(text, x, y, self.colors[self.color_index], font_size=26, width=600, align="center")

    def on_update(self, delta_time):
        # Actualiza la posición del texto para que se mueva hacia la izquierda
        self.text_x -= self.text_speed

        # Si el texto se sale de la pantalla por la izquierda, lo reiniciamos en la derecha
        if self.text_x < -200:
            self.text_x = SCREEN_WIDTH

        # Cambiar el color del texto en cada cuadro
        self.color_index = (self.color_index + 1) % len(self.colors)

def main():
    game = MyGame()
    arcade.run()

if __name__ == "__main__":
    main()
