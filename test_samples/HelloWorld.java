public class HelloWorld {
    // This is a simple Java program
    private String message;
    
    /**
     * Constructor for HelloWorld
     * @param msg The message to display
     */
    public HelloWorld(String msg) {
        this.message = msg;
    }
    
    /**
     * Main method - entry point of the program
     */
    public static void main(String[] args) {
        HelloWorld hello = new HelloWorld("Hello, World!");
        hello.printMessage();
        
        // Demonstrate some Java features
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
    
    /**
     * Print the stored message
     */
    public void printMessage() {
        System.out.println(this.message);
    }
    
    /**
     * Calculate factorial recursively
     * @param n The number to calculate factorial for
     * @return The factorial of n
     */
    public static long factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}
