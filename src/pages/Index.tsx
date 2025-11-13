import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  total: number;
  date: string;
}

interface HomeContent {
  title: string;
  subtitle: string;
  description: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'catalog' | 'about' | 'news' | 'admin'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [homeContent, setHomeContent] = useState<HomeContent>({
    title: 'Русские Пекари',
    subtitle: 'Традиционная выпечка с душой',
    description: 'Мы печем самый вкусный хлеб в Иваново с 1995 года. Используем только натуральные ингредиенты и проверенные временем рецепты.'
  });

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Бородинский хлеб', description: 'Классический темный хлеб с кориандром', price: 85, category: 'Хлеб', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { id: 2, name: 'Белый батон', description: 'Мягкий пшеничный батон', price: 45, category: 'Хлеб', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400' },
    { id: 3, name: 'Круассан', description: 'Свежий французский круассан', price: 65, category: 'Выпечка', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
    { id: 4, name: 'Пирожок с капустой', description: 'Домашний пирожок с капустой', price: 55, category: 'Пироги', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400' },
    { id: 5, name: 'Эклер', description: 'Заварное пирожное с кремом', price: 75, category: 'Десерты', image: 'https://images.unsplash.com/photo-1612201142855-0c8e6e30a1e4?w=400' },
    { id: 6, name: 'Ржаной хлеб', description: 'Полезный хлеб из цельнозерновой муки', price: 90, category: 'Хлеб', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc04?w=400' },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingContent, setEditingContent] = useState(false);
  const [tempHomeContent, setTempHomeContent] = useState(homeContent);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast.loading('Заказ обрабатывается...', { duration: 2000 });
    
    setTimeout(() => {
      const newOrder: Order = {
        id: orders.length + 1,
        items: [...cart],
        customerName: formData.get('name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        total: getCartTotal(),
        date: new Date().toLocaleString('ru-RU')
      };
      
      setOrders([...orders, newOrder]);
      setCart([]);
      setIsCheckoutOpen(false);
      
      toast.success('Заказ оформлен! В течении 30-60 минут с вами свяжутся.', { duration: 4000 });
    }, 2000);
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        description: newProduct.description || '',
        price: newProduct.price,
        category: newProduct.category || 'Разное',
        image: newProduct.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
      };
      setProducts([...products, product]);
      setNewProduct({});
      toast.success('Товар добавлен');
    }
  };

  const deleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Товар удален');
  };

  const saveHomeContent = () => {
    setHomeContent(tempHomeContent);
    setEditingContent(false);
    toast.success('Контент обновлен');
  };

  const exportData = () => {
    const data = { products, orders, homeContent };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bakery-data.json';
    a.click();
    toast.success('Данные экспортированы');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.products) setProducts(data.products);
          if (data.orders) setOrders(data.orders);
          if (data.homeContent) setHomeContent(data.homeContent);
          toast.success('Данные импортированы');
        } catch (error) {
          toast.error('Ошибка импорта данных');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-secondary text-secondary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/b958f4ff-3745-4b9d-8782-dd86b975e688.png" 
                alt="Русские Пекари" 
                className="w-14 h-14 rounded-full shadow-md"
              />
              <span className="text-2xl font-bold font-handwritten">Русские Пекари</span>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveSection('home')}
                className={`transition-all hover:text-primary ${activeSection === 'home' ? 'text-primary font-semibold' : ''}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActiveSection('catalog')}
                className={`transition-all hover:text-primary ${activeSection === 'catalog' ? 'text-primary font-semibold' : ''}`}
              >
                Каталог
              </button>
              <button 
                onClick={() => setActiveSection('about')}
                className={`transition-all hover:text-primary ${activeSection === 'about' ? 'text-primary font-semibold' : ''}`}
              >
                О нас
              </button>
              <button 
                onClick={() => setActiveSection('news')}
                className={`transition-all hover:text-primary ${activeSection === 'news' ? 'text-primary font-semibold' : ''}`}
              >
                Новости
              </button>
              
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={24} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>
                      {cart.length === 0 ? 'Корзина пуста' : `Товаров: ${cart.length}`}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="X" size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {cart.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Итого:</span>
                        <span>{getCartTotal()} ₽</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsCheckoutOpen(true);
                        }}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsAdminOpen(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold font-handwritten text-primary">{homeContent.title}</h1>
              <p className="text-2xl text-muted-foreground">{homeContent.subtitle}</p>
              <p className="text-lg">{homeContent.description}</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-center font-handwritten">Популярные товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.slice(0, 3).map(product => (
                  <Card key={product.id} className="hover:shadow-xl transition-shadow">
                    <CardHeader className="p-0">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                      <p className="text-2xl font-bold text-primary mt-3">{product.price} ₽</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'catalog' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-center font-handwritten text-primary">Каталог</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Card key={product.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader className="p-0">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <Badge className="absolute top-2 right-2">{product.category}</Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                    <p className="text-2xl font-bold text-primary mt-3">{product.price} ₽</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold text-center font-handwritten text-primary">О нас</h1>
            <Card>
              <CardContent className="p-8 space-y-4 text-lg">
                <p>
                  Пекарня "Русские Пекари" работает в Иваново с 1995 года. Мы гордимся тем, что сохраняем традиции русской выпечки и используем только натуральные ингредиенты.
                </p>
                <p>
                  Наши мастера-пекари передают свое мастерство из поколения в поколение, создавая хлеб и выпечку по проверенным временем рецептам.
                </p>
                <p>
                  Мы печем свежий хлеб каждый день, чтобы вы могли наслаждаться его неповторимым вкусом и ароматом.
                </p>
                <div className="pt-4 border-t">
                  <h3 className="text-xl font-bold mb-2">Наши контакты:</h3>
                  <p>📍 г. Иваново, ул. Текстильщиков, 15</p>
                  <p>📞 +7 (4932) 123-456</p>
                  <p>⏰ Ежедневно с 7:00 до 21:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold text-center font-handwritten text-primary">Новости</h1>
            <Card>
              <CardHeader>
                <CardTitle>Новые позиции в меню!</CardTitle>
                <CardDescription>12 ноября 2025</CardDescription>
              </CardHeader>
              <CardContent>
                Мы рады сообщить, что добавили в наше меню новые виды выпечки. Теперь вы можете попробовать наши фирменные круассаны и эклеры!
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Скидка на хлеб по выходным</CardTitle>
                <CardDescription>5 ноября 2025</CardDescription>
              </CardHeader>
              <CardContent>
                Каждые выходные на весь ассортимент хлеба действует скидка 15%. Приходите за свежим хлебом в субботу и воскресенье!
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>30 лет с вами!</CardTitle>
                <CardDescription>1 октября 2025</CardDescription>
              </CardHeader>
              <CardContent>
                В этом году нашей пекарне исполнилось 30 лет. Спасибо, что вы с нами все эти годы! Мы продолжаем радовать вас вкусной выпечкой.
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните данные для доставки
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" required placeholder="Иван Иванов" />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" required type="tel" placeholder="+7 (999) 123-45-67" />
              </div>
              <div>
                <Label htmlFor="address">Адрес доставки</Label>
                <Textarea id="address" name="address" required placeholder="г. Иваново, ул. Ленина, д. 1, кв. 1" />
              </div>
              <div className="flex items-center justify-between text-lg font-bold border-t pt-4">
                <span>Итого:</span>
                <span className="text-primary">{getCartTotal()} ₽</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" size="lg">
                Оформить заказ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Админ-панель</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Главная</TabsTrigger>
              <TabsTrigger value="products">Товары</TabsTrigger>
              <TabsTrigger value="orders">Заказы</TabsTrigger>
              <TabsTrigger value="data">Данные</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {!editingContent ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{homeContent.title}</CardTitle>
                      <CardDescription>{homeContent.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{homeContent.description}</p>
                    </CardContent>
                  </Card>
                  <Button onClick={() => {
                    setEditingContent(true);
                    setTempHomeContent(homeContent);
                  }}>
                    Редактировать
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Заголовок</Label>
                    <Input 
                      value={tempHomeContent.title}
                      onChange={(e) => setTempHomeContent({...tempHomeContent, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Подзаголовок</Label>
                    <Input 
                      value={tempHomeContent.subtitle}
                      onChange={(e) => setTempHomeContent({...tempHomeContent, subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Описание</Label>
                    <Textarea 
                      value={tempHomeContent.description}
                      onChange={(e) => setTempHomeContent({...tempHomeContent, description: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveHomeContent}>Сохранить</Button>
                    <Button variant="outline" onClick={() => setEditingContent(false)}>Отмена</Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить товар</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input 
                    placeholder="Название"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Описание"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                  <Input 
                    placeholder="Цена"
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  />
                  <Input 
                    placeholder="Категория"
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  />
                  <Input 
                    placeholder="URL изображения"
                    value={newProduct.image || ''}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  />
                  <Button onClick={addProduct} className="w-full">Добавить товар</Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h3 className="font-bold">Все товары ({products.length})</h3>
                {products.map(product => (
                  <Card key={product.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>{product.price} ₽</CardDescription>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <h3 className="font-bold text-lg">Все заказы ({orders.length})</h3>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Заказов пока нет</p>
              ) : (
                orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Заказ #{order.id}</CardTitle>
                        <Badge>{order.total} ₽</Badge>
                      </div>
                      <CardDescription>{order.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="font-medium">Клиент: {order.customerName}</p>
                        <p className="text-sm text-muted-foreground">Телефон: {order.phone}</p>
                        <p className="text-sm text-muted-foreground">Адрес: {order.address}</p>
                      </div>
                      <div className="border-t pt-2">
                        <p className="font-medium mb-2">Товары:</p>
                        {order.items.map(item => (
                          <p key={item.id} className="text-sm">
                            {item.name} x{item.quantity} - {item.price * item.quantity} ₽
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Экспорт/Импорт данных</CardTitle>
                  <CardDescription>
                    Сохраните или загрузите данные магазина в формате JSON
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={exportData} className="w-full">
                    <Icon name="Download" size={18} className="mr-2" />
                    Экспортировать данные
                  </Button>
                  <div>
                    <Label htmlFor="import-file" className="cursor-pointer">
                      <div className="w-full border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Нажмите для импорта данных</p>
                      </div>
                    </Label>
                    <Input 
                      id="import-file" 
                      type="file" 
                      accept=".json"
                      className="hidden"
                      onChange={importData}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <footer className="bg-secondary text-secondary-foreground mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-handwritten">🍞 Русские Пекари — традиции с 1995 года</p>
          <p className="text-sm mt-2 text-muted-foreground">г. Иваново • +7 (4932) 123-456</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
