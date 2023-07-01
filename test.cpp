#include <iostream>
#include <windows.h>
using namespace std;

int main(int argc, char **argv) {
  for(int i = 1; i <= 10; i++) {
    cout<<i<<endl;
    Sleep(1000);
  }
}