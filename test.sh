docker run -i -v  "$PWD"/java_code/java-1563456968371-8023/:/usr/src/myapp -w /usr/src/myapp openjdk:8 javac abc.java
docker run -i -v  "$PWD"/java_code/java-1563456968371-8023/:/usr/src/myapp -w /usr/src/myapp openjdk:8 java abc < "$PWD"/java_code/java-1563456968371-8023/abc_input.txt > "$PWD"/java_code/java-1563456968371-8023/abc_out.txt